import { BookFindErrors, IBookRepo, SearchManyProps } from "@/resources/domain/contracts";
import {
  Book,
  BookAuthor,
  BookCategory,
  BookChapter,
  BookContent,
  BookContentTypes,
  BookErrors,
  BookSource,
  BookTag,
} from "@/resources/domain/entities";
import { BookNotFoundError } from "@/resources/domain/errors";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either, isLeft, left, right } from "fp-ts/Either";
import { FilterQuery, Model, Mongoose } from "mongoose";
import { BookSchema } from "../schemas";
import {
  DbBook,
  DbBookAuthor,
  DbBookCategory,
  DbBookChapter,
  DbBookContent,
  DbBookPopulated,
  DbBookTag,
  DbSource,
} from "../schemas/book";

export class BookRepo implements IBookRepo {
  private constructor(private readonly repo: Model<DbBook>) {}

  static New(colName: string, db: Mongoose) {
    return new BookRepo(db.model<DbBook>(colName, BookSchema));
  }

  async deleteMany(): Promise<boolean> {
    return true;
  }
  async deleteOne(): Promise<boolean> {
    return true;
  }
  async findMany(): Promise<Either<BookFindErrors, Book[]>> {
    const booksResp = await this.repo
      .find()
      .sort({ createdAt: -1 })
      .populate("authors")
      .populate("tags")
      .populate("categories")
      .lean()
      .exec();
    const books = [];
    for (const book of booksResp) {
      const bookResp = mapDbToDomain(book as unknown as DbBookPopulated);
      if (isLeft(bookResp)) return bookResp;
      books.push(bookResp.right);
    }
    return right(books);
  }
  async search(props: SearchManyProps): Promise<Either<BookFindErrors, Book[]>> {
    const { search_term } = props;
    const filters: FilterQuery<DbBook> = {};

    if (search_term) {
      filters.$or = [
        {
          title: { $regex: new RegExp(search_term, "i") },
        },
      ];
    }

    try {
      const booksResp = await this.repo
        .find(filters)
        .sort({ createdAt: -1 })
        .populate("authors")
        .populate("tags")
        .populate("categories")
        .lean()
        .exec();
      const books = [];
      for (const book of booksResp) {
        const bookResp = mapDbToDomain(book as unknown as DbBookPopulated);
        if (isLeft(bookResp)) return bookResp;
        books.push(bookResp.right);
      }

      return right(books);
    } catch (error) {
      console.error("Error searching books:", error);
      return left(new BookNotFoundError());
    }
  }

  async findOneById(id: Id): Promise<Either<BookFindErrors, Book>> {
    const bookResp = await this.repo
      .findById(id.value)
      .populate("authors")
      .populate("tags")
      .populate("categories")
      .lean()
      .exec();
    if (!bookResp) return left(new BookNotFoundError());
    return mapDbToDomain(bookResp as unknown as DbBookPopulated);
  }
  async insertMany(entities: Book[]): Promise<void> {}
  async insertOne(entity: Book): Promise<void> {
    const data = mapDomainToDb(entity);
    await this.repo.create(data);
  }
  async update(entity: Book): Promise<boolean> {
    return true;
  }
  async updateMany(entities: Book[]): Promise<boolean> {
    return true;
  }
}

const mapDbToDomain = (entity: DbBookPopulated): Either<BookErrors | InvalidIdError, Book> => {
  const bookIdResp = Id.create();
  if (isLeft(bookIdResp)) return bookIdResp;
  const bookId = bookIdResp.right;

  const mapAuthor = (entity: DbBookAuthor): Either<InvalidIdError, BookAuthor> => {
    const idResp = Id.create();
    if (isLeft(idResp)) return idResp;
    const id = idResp.right;

    return right({
      id: id,
      names: entity.names,
    });
  };

  const authors: BookAuthor[] = [];
  for (const author of entity.authors) {
    const resp = mapAuthor(author);
    if (isLeft(resp)) return resp;
    authors.push(resp.right);
  }

  const mapCategory = (entity: DbBookCategory): Either<InvalidIdError, BookCategory> => {
    const idResp = Id.create();
    if (isLeft(idResp)) return idResp;
    const id = idResp.right;

    return right({
      id: id,
      name: entity.name,
    });
  };

  const mapTag = (entity: DbBookTag): Either<InvalidIdError, BookTag> => {
    const idResp = Id.create();
    if (isLeft(idResp)) return idResp;
    const id = idResp.right;

    return right({
      id: id,
      name: entity.name,
    });
  };

  const mapContent = (entity: DbBookContent): Either<InvalidIdError, BookContent> => {
    const idResp = Id.create();
    if (isLeft(idResp)) return idResp;
    const id = idResp.right;

    const mapChapter = (entity: DbBookChapter): Either<InvalidIdError, BookChapter> => {
      const idResp = Id.create();
      if (isLeft(idResp)) return idResp;
      const id = idResp.right;

      return right({
        id: id,
        name: entity.name,
        type: BookContentTypes.CHAPTER,
        duration: entity.duration,
        goals: entity.goals,
        notes: entity.notes,
      });
    };

    switch (entity.type) {
      case BookContentTypes.CHAPTER:
        return right({
          id: id,
          name: entity.name,
          type: BookContentTypes.CHAPTER,
          duration: entity.duration,
          goals: entity.goals,
          notes: entity.notes,
        });

      case BookContentTypes.SECTION:
        const chapters: BookChapter[] = [];
        for (const chapter of entity.chapters) {
          const resp = mapChapter(chapter);
          if (isLeft(resp)) return resp;
          chapters.push(resp.right);
        }

        return right({
          id: id,
          name: entity.name,
          type: BookContentTypes.SECTION,
          chapters: chapters,
        });
    }
  };

  const categories: BookCategory[] = [];
  for (const category of entity.categories) {
    const resp = mapCategory(category);
    if (isLeft(resp)) return resp;
    categories.push(resp.right);
  }

  const tags: BookTag[] = [];
  for (const tag of entity.tags) {
    const resp = mapTag(tag);
    if (isLeft(resp)) return resp;
    tags.push(resp.right);
  }

  const contents: BookContent[] = [];
  for (const content of entity.contents) {
    const resp = mapContent(content);
    if (isLeft(resp)) return resp;
    contents.push(resp.right);
  }

  const mapSource = (entity: DbSource): BookSource => ({
    extension: entity.extension,
    url: entity.url,
  });

  const bookResp = Book.create({
    id: bookId,
    isbn: entity.isbn,
    title: entity.title,
    edition: entity.edition,
    cover: entity.cover,
    year: entity.year,
    description: entity.description,
    authors: authors,
    categories: categories,
    tags: tags,
    contents: contents,
    sources: entity.sources.map((source) => mapSource(source)),
  });

  if (isLeft(bookResp)) return bookResp;
  return right(bookResp.right);
};

const mapDomainToDb = (entity: Book): DbBook => {
  const mapContent = (content: BookContent): DbBookContent => {
    switch (content.type) {
      case BookContentTypes.CHAPTER:
        return {
          _id: content.id.value,
          name: content.name,
          type: BookContentTypes.CHAPTER,
          duration: content.duration,
          goals: content.goals,
          notes: content.notes,
        };

      case BookContentTypes.SECTION:
        return {
          _id: content.id.value,
          name: content.name,
          type: BookContentTypes.SECTION,
          chapters: content.chapters.map((chapter) => ({
            _id: chapter.id.value,
            name: chapter.name,
            type: BookContentTypes.CHAPTER,
            duration: chapter.duration,
            goals: chapter.goals,
            notes: chapter.notes,
          })),
        };
    }
  };

  return {
    _id: entity.id.value,
    isbn: entity.isbn,
    type: entity.type,
    title: entity.title,
    edition: entity.edition,
    cover: entity.cover,
    year: entity.year,
    description: entity.description,
    authors: entity.authors.map((author) => author.id.value),
    categories: entity.categories.map((category) => category.id.value),
    tags: entity.tags.map((tag) => tag.id.value),
    contents: entity.contents.map((content) => mapContent(content)),
    sources: entity.sources.map((source) => ({
      url: source.url,
      extension: source.extension,
    })),
  };
};
