// books/infra/repositories/book-repository.ts
// Storage-agnostic repository + explicit per-type mappers.
// Assumes: BookBase/BookBaseProps VOs, concrete classes expose `readonly type: BookTypes`,

import { BookTypes } from "@/books/domain/constants";
import { IRepository } from "@/books/domain/contracts";
import {
  Book, // union of all concrete classes
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
import { AuthorFullName, BookAuthors, BookTitle } from "@/books/domain/value-objects";
import { Id } from "@/shared/value-objects";
import { ClientSession, Collection, ObjectId } from "mongodb";
import { DbBook } from "../schemas"; // {_id, type, title, authors:[{id, full_name}]}

// ---------- Per-type mappers (domain <-> persistence) ----------

type ToDomain = (row: DbBook) => Book;
type ToPersistence = (entity: Book) => DbBook;

/**
 * Normalize DB -> Domain base props.
 * Prefer *_fromPrimitives() to mirror your `toPrimitives()` usage in entities.
 * If your VOs use `.make(...)` return Either, adapt with unwrap or safe handling.
 */
const baseToDomainProps = (row: DbBook) => ({
  id: Id.fromPrimitives(row._id), // if you only have `make`, do: Id.make(String(row._id))
  title: BookTitle.make(row.title),
  authors: BookAuthors.make(
    // Map persistence author objects into your VO primitive shape
    row.authors.map((a) => ({ id: Id.fromPrimitives(a.id), fullName: AuthorFullName.make(a.full_name) })),
  ),
});

/** Domain -> Persistence base projection */
const baseToPersistence = (entity: Book): DbBook => ({
  _id: new ObjectId(entity.id().toString()),
  type: entity.type, // enum value already matches Db schema
  title: entity.title(),
  authors: entity.authors().map((e) => ({ id: new ObjectId(e.id.toString()), full_name: e.fullName })), // should yield [{id, full_name}, ...]
});

// Factories per kind (no extra attributes per your classes)
const typeToDomainFactory: Record<BookTypes, ToDomain> = {
  [BookTypes.SECTION_CHAPTER]: (row) => BookSectionChapter.create(baseToDomainProps(row)),
  [BookTypes.CHAPTER_ONLY]: (row) => BookChapterOnly.create(baseToDomainProps(row)),
  [BookTypes.UNIT_LESSON]: (row) => BookUnitLesson.create(baseToDomainProps(row)),
  [BookTypes.MODULE]: (row) => BookModule.create(baseToDomainProps(row)),
  [BookTypes.TOPIC]: (row) => BookTopic.create(baseToDomainProps(row)),
  [BookTypes.ENTRY_ARTICLE]: (row) => BookEntryArticle.create(baseToDomainProps(row)),
  [BookTypes.ACT_ARC]: (row) => BookActArc.create(baseToDomainProps(row)),
  [BookTypes.CASE_STUDY]: (row) => BookCaseStudy.create(baseToDomainProps(row)),
  [BookTypes.PRACTICE_EXERCISE]: (row) => BookPracticeExercise.create(baseToDomainProps(row)),
  [BookTypes.VOLUME]: (row) => BookVolume.create(baseToDomainProps(row)),
  [BookTypes.INDEPENDENT_STORY]: (row) => BookIndependentStory.create(baseToDomainProps(row)),
  [BookTypes.TIMELINE]: (row) => BookTimeline.create(baseToDomainProps(row)),
  [BookTypes.ALPHABETICAL]: (row) => BookAlphabetical.create(baseToDomainProps(row)),
  [BookTypes.MANUAL_REFERENCE]: (row) => BookManualReference.create(baseToDomainProps(row)),
  [BookTypes.MAP_DIAGRAM]: (row) => BookMapDiagram.create(baseToDomainProps(row)),
};

const typeToPersistenceFactory: Record<BookTypes, ToPersistence> = {
  [BookTypes.SECTION_CHAPTER]: (e) => baseToPersistence(e),
  [BookTypes.CHAPTER_ONLY]: (e) => baseToPersistence(e),
  [BookTypes.UNIT_LESSON]: (e) => baseToPersistence(e),
  [BookTypes.MODULE]: (e) => baseToPersistence(e),
  [BookTypes.TOPIC]: (e) => baseToPersistence(e),
  [BookTypes.ENTRY_ARTICLE]: (e) => baseToPersistence(e),
  [BookTypes.ACT_ARC]: (e) => baseToPersistence(e),
  [BookTypes.CASE_STUDY]: (e) => baseToPersistence(e),
  [BookTypes.PRACTICE_EXERCISE]: (e) => baseToPersistence(e),
  [BookTypes.VOLUME]: (e) => baseToPersistence(e),
  [BookTypes.INDEPENDENT_STORY]: (e) => baseToPersistence(e),
  [BookTypes.TIMELINE]: (e) => baseToPersistence(e),
  [BookTypes.ALPHABETICAL]: (e) => baseToPersistence(e),
  [BookTypes.MANUAL_REFERENCE]: (e) => baseToPersistence(e),
  [BookTypes.MAP_DIAGRAM]: (e) => baseToPersistence(e),
};

// ---------- Mapper façade ----------

export const BookMappers = {
  toDomain(row: DbBook): Book {
    const factory = typeToDomainFactory[row.type];
    if (!factory) {
      throw new Error(`Unsupported book type: ${row.type}`);
    }
    return factory(row);
  },

  toPersistence(entity: Book): DbBook {
    const type = entity.type;
    const factory = typeToPersistenceFactory[type];
    if (!factory) {
      throw new Error(`Unsupported book type: ${type}`);
    }
    return factory(entity);
  },
};

// ---------- Repository implementation ----------

export class BookRepository implements IRepository {
  constructor(
    private readonly col: Collection<DbBook>,
    private readonly session?: ClientSession,
  ) {}

  /** Find a book by its Id VO */
  async findOneById(id: Id): Promise<Book | null> {
    const row = await this.col.findOne({ _id: id }, { session: this.session });
    if (!row) return null;
    return BookMappers.toDomain(row);
  }

  /** Create (persist) a domain book */
  async createOne(payload: Book): Promise<void> {
    const doc = BookMappers.toPersistence(payload);
    await this.col.insertOne(doc, { session: this.session });
  }
}
