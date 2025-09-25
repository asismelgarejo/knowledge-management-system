import { IBookRepo } from "@/resources/domain/contracts";
import { Book, BookChapter, BookContent, BookContentTypes, BookErrors } from "@/resources/domain/entities";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { ICommandHandler } from "@/resources/shared/utils/cqrs/command-bus";
import { CommandDecorator, CommandHandlerDecorator } from "@/resources/shared/utils/cqrs/decorators";
import { Either, isLeft, right } from "fp-ts/Either";
import { ObjectId } from "mongoose";

type Chapter = string;
type Section = {
  name: string;
  chapters: Chapter[];
};

type Content = Section | Chapter;

type CreateBookCommandProps = {
  authors: ObjectId[];
  categories: ObjectId[];
  contents: Content[];
  cover: string;
  description: string;
  edition: number;
  isbn: string;
  sources: [];
  tags: ObjectId[];
  title: string;
  year: number;
};

@CommandDecorator()
export class CreateBookCommand {
  authors: ObjectId[];
  categories: ObjectId[];
  contents: Content[];
  cover: string;
  description: string;
  edition: number;
  isbn: string;
  sources: [];
  tags: ObjectId[];
  title: string;
  year: number;
  constructor(props: CreateBookCommandProps) {
    this.authors = props.authors;
    this.categories = props.categories;
    this.contents = props.contents;
    this.cover = props.cover;
    this.description = props.description;
    this.edition = props.edition;
    this.isbn = props.isbn;
    this.sources = props.sources;
    this.tags = props.tags;
    this.title = props.title;
    this.year = props.year;
  }
}

export type CreateBookErrors = BookErrors;

@CommandHandlerDecorator(CreateBookCommand)
export class CreateBookHandler implements ICommandHandler {
  constructor(private readonly repo: IBookRepo) {}
  async execute(command: CreateBookCommand): Promise<Either<CreateBookErrors | InvalidIdError, Book>> {
    const bookIdResp = Id.create();
    if (isLeft(bookIdResp)) return bookIdResp;
    const bookId = bookIdResp.right;

    const contents: BookContent[] = [];

    for (const content of command.contents) {
      if (typeof content === "string") {
        const chapIdResp = Id.create();
        if (isLeft(chapIdResp)) return chapIdResp;
        const chapId = chapIdResp.right;
        contents.push({
          id: chapId,
          type: BookContentTypes.CHAPTER,
          name: content,
          duration: 0,
          goals: [],
          notes: [],
        });
        continue;
      }
      const sectionIdResp = Id.create();
      if (isLeft(sectionIdResp)) return sectionIdResp;
      const sectionId = sectionIdResp.right;

      const chapters: BookChapter[] = [];

      for (const chapter of content.chapters) {
        const chapIdResp = Id.create();
        if (isLeft(chapIdResp)) return chapIdResp;
        const chapId = chapIdResp.right;
        chapters.push({
          id: chapId,
          type: BookContentTypes.CHAPTER,
          name: chapter,
          duration: 0,
          goals: [],
          notes: [],
        });
      }
      contents.push({
        id: sectionId,
        type: BookContentTypes.SECTION,
        name: content.name,
        chapters,
      });
    }

    const bookResp = Book.create({
      id: bookId,
      authors: [],
      categories: [],
      contents: contents,
      cover: command.cover,
      description: command.description,
      edition: command.edition,
      isbn: command.isbn,
      sources: [],
      tags: [],
      title: command.title,
      year: command.year,
    });
    if (isLeft(bookResp)) return bookResp;
    const book = bookResp.right;
    await this.repo.insertOne(book);
    return right(book);
  }
}
