import { BookTypes } from "@/books/domain/constants";
import {
  Book,
  BookActArc,
  BookAlphabetical,
  BookCaseStudy,
  BookChapterOnly,
  BookEntryArticle,
  BookIndependentStory,
  BookManualReference,
  BookMapDiagram,
  BookModule,
  BookPracticeExercise,
  BookSectionChapter,
  BookTimeline,
  BookTopic,
  BookUnitLesson,
  BookVolume,
} from "@/books/domain/entities";
import { AuthorFullName, AuthorRef, BookAuthors, BookTitle } from "@/books/domain/value-objects";
import { IUnitOfWork } from "@/books/shared/uow";
import { ICommandHandler } from "@/shared/utils/cqrs/command-bus";
import { CommandHandlerDecorator } from "@/shared/utils/cqrs/decorators";
import { Id } from "@/shared/value-objects";
import { Either, right } from "fp-ts/Either";
import { CreateBookCommand } from "./command";
/**
 * Handler: CreateBook
 * - Single command for all kinds (CQRS).
 * - Discriminates by `command.type` to instantiate the right Book class.
 * - Uses VOs; any invalid input throws -> we catch and return Left<void>.
 */
@CommandHandlerDecorator(CreateBookCommand)
export class HandlerCreateBookCommand implements ICommandHandler {
  constructor(private readonly uow: IUnitOfWork) {}

  async execute({ props: command }: CreateBookCommand): Promise<Either<void, Book>> {
    // --- Build common VOs ---
    const bookId = Id.make();
    const title = BookTitle.make(command.title);
    // authors: string[] -> AuthorRef[] -> BookAuthors
    const authorRefs: ReadonlyArray<AuthorRef> = command.authors.map((fullName) => ({
      id: Id.make(), // if you already have Author IDs, map them here instead
      fullName: AuthorFullName.make(fullName),
    }));
    const authors = BookAuthors.make(authorRefs);

    // --- Factory by type (no extra attributes as per your classes) ---
    const baseProps = { id: bookId, title, authors };

    const book: Book = (() => {
      switch (command.type) {
        case BookTypes.ACT_ARC:
          return BookActArc.create(baseProps);
        case BookTypes.ALPHABETICAL:
          return BookAlphabetical.create(baseProps);
        case BookTypes.CASE_STUDY:
          return BookCaseStudy.create(baseProps);
        case BookTypes.CHAPTER_ONLY:
          return BookChapterOnly.create(baseProps);
        case BookTypes.ENTRY_ARTICLE:
          return BookEntryArticle.create(baseProps);
        case BookTypes.INDEPENDENT_STORY:
          return BookIndependentStory.create(baseProps);
        case BookTypes.MANUAL_REFERENCE:
          return BookManualReference.create(baseProps);
        case BookTypes.MAP_DIAGRAM:
          return BookMapDiagram.create(baseProps);
        case BookTypes.MODULE:
          return BookModule.create(baseProps);
        case BookTypes.PRACTICE_EXERCISE:
          return BookPracticeExercise.create(baseProps);
        case BookTypes.SECTION_CHAPTER:
          return BookSectionChapter.create(baseProps);
        case BookTypes.TIMELINE:
          return BookTimeline.create(baseProps);
        case BookTypes.TOPIC:
          return BookTopic.create(baseProps);
        case BookTypes.UNIT_LESSON:
          return BookUnitLesson.create(baseProps);
        case BookTypes.VOLUME:
          return BookVolume.create(baseProps);
      }
    })();

    // --- Persist & return ---
    await this.uow.bookRepo.createOne(book);
    return right(book);
  }
}
