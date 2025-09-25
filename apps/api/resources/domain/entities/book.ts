import {
  InvalidBookAuthorError,
  InvalidBookAuthorNameError,
  InvalidBookCategoryError,
  InvalidBookCategoryNameError,
  InvalidBookContentChapterNameError,
  InvalidBookContentError,
  InvalidBookContentSectionNameError,
  InvalidBookCoverError,
  InvalidBookDescriptionError,
  InvalidBookEditionError,
  InvalidBookSourceExtensionError,
  InvalidBookSourceUrlError,
  InvalidBookTagError,
  InvalidBookTagNameError,
  InvalidBookTitleError,
  InvalidBookYearError,
  InvalidISBNError,
} from "@/resources/domain/errors";
import { DomainEvent, Id, validateArrayItems, validateWithSchema } from "@/shared/utils";
import { Either, isLeft, right } from "fp-ts/Either";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";
import z from "zod";
import { ResourceTypes } from "./interfaces";

//#region Domain Events

/**
 * Event fired when a new book is created
 */
export interface BookCreatedEvent extends DomainEvent {
  readonly eventType: "BookCreated";
  readonly bookData: {
    isbn: string;
    title: string;
    authors: NonEmptyArray<BookAuthor>;
    year: number;
  };
}

/**
 * Event fired when book metadata is updated
 */
export interface BookMetadataUpdatedEvent extends DomainEvent {
  readonly eventType: "BookMetadataUpdated";
  readonly changes: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
}

/**
 * Event fired when book content structure is updated
 */
export interface BookContentUpdatedEvent extends DomainEvent {
  readonly eventType: "BookContentUpdated";
  readonly contentChanges: {
    addedChapters: number;
    removedChapters: number;
    addedSections: number;
    removedSections: number;
  };
}

/**
 * Event fired when book sources are updated
 */
export interface BookSourcesUpdatedEvent extends DomainEvent {
  readonly eventType: "BookSourcesUpdated";
  readonly sourceChanges: {
    added: BookSource[];
    removed: BookSource[];
  };
}

/**
 * Union type of all book domain events
 */
export type BookDomainEvent =
  | BookCreatedEvent
  | BookMetadataUpdatedEvent
  | BookContentUpdatedEvent
  | BookSourcesUpdatedEvent;

//#endregion

//#region enums
/**
 * Supported file extensions for book sources
 */
export enum BookExtensionsTypes {
  /** PDF document format */
  pdf = "pdf",
  /** EPUB electronic publication format */
  epub = "epub",
}
/**
 * Types of content that can be contained within a book
 */
export enum BookContentTypes {
  /** Individual chapter within a book */
  CHAPTER = "BOOK_CHAPTER",
  /** Section containing multiple chapters */
  SECTION = "BOOK_SECTION",
}
//#region enums

//#region books

/**
 * Represents a source where the book can be accessed
 */
export type BookSource = {
  /** The URL where the book file is located */
  url: string;
  /** The file extension/format of the book source */
  extension: BookExtensionsTypes;
};

/**
 * Represents an author of a book
 */
export type BookAuthor = {
  /** Unique identifier for the author */
  id: Id;
  /** The author's full name */
  names: string;
};
/**
 * Represents a category that a book belongs to
 */
export type BookCategory = {
  /** Unique identifier for the category */
  id: Id;
  /** The name of the category (e.g., "Fiction", "Science", "History") */
  name: string;
};
/**
 * Represents a tag for additional book classification
 */
export type BookTag = {
  /** Unique identifier for the tag */
  id: Id;
  /** The tag name for searchability and organization */
  name: string;
};
/**
 * Represents a chapter within a book
 */
export type BookChapter = {
  /** Unique identifier for the chapter */
  id: Id;
  /** The chapter title/name */
  name: string;
  /** Content type discriminator - always CHAPTER */
  readonly type: BookContentTypes.CHAPTER;
};
/**
 * Represents a section containing multiple chapters
 */
export type BookSection = {
  /** Unique identifier for the section */
  id: Id;
  /** The section title/name */
  name: string;
  /** Content type discriminator - always SECTION */
  readonly type: BookContentTypes.SECTION;
  /** Non-empty array of chapters within this section */
  chapters: NonEmptyArray<BookChapter>;
};

/**
 * Union type representing either a chapter or section in a book
 */
export type BookContent = BookChapter | BookSection;

/**
 * Properties required to create a Book instance
 */
export type BookProps = {
  /** Unique identifier for the book */
  id: Id;
  /** International Standard Book Number */
  isbn: string;
  /** The book's title */
  title: string;
  /** Edition number (1st, 2nd, etc.) */
  edition: number;
  /** Non-empty array of sources where the book can be accessed */
  sources: NonEmptyArray<BookSource>;
  /** URL to the book's cover image */
  cover: string;
  /** Publication year */
  year: number;
  /** Non-empty array of book authors */
  authors: NonEmptyArray<BookAuthor>;
  /** Categories the book belongs to */
  categories: BookCategory[];
  /** Tags for additional classification */
  tags: BookTag[];
  /** Non-empty array of book content (chapters and sections) */
  contents: NonEmptyArray<BookContent>;
  /** Optional description or summary of the book */
  description?: string;
};

/**
 * Union type of all possible validation errors that can occur when creating or updating a Book
 */
export type BookErrors =
  | InvalidBookTitleError
  | InvalidBookSourceUrlError
  | InvalidBookSourceExtensionError
  | InvalidISBNError
  | InvalidBookEditionError
  | InvalidBookCoverError
  | InvalidBookYearError
  | InvalidBookDescriptionError
  | InvalidBookAuthorError
  | InvalidBookCategoryError
  | InvalidBookTagError
  | InvalidBookContentError;

export class Book {
  // Unique identifier for the book - immutable once set
  readonly #id: Id;
  // Resource type identifier to distinguish from other domain entities
  readonly type = ResourceTypes.BOOK;
  // International Standard Book Number - unique book identifier
  #isbn: string;
  // Edition number of the book (1st edition, 2nd edition, etc.)
  #edition: number;
  // Title of the book
  #title: string;
  // URL to the book's cover image
  #cover: string;
  // Publication year of the book
  #year: number;
  // List of authors who wrote the book
  #authors: NonEmptyArray<BookAuthor>;
  // Optional description or summary of the book
  #description?: string;
  // Categories the book belongs to (e.g., Fiction, Science, History)
  #categories: BookCategory[];
  // Tags for additional classification and searchability
  #tags: BookTag[];
  // Table of contents - chapters and sections within the book
  #contents: NonEmptyArray<BookContent>;
  // Available sources where the book can be accessed (URLs with file types)
  #sources: NonEmptyArray<BookSource>;
  // Domain events that have occurred on this aggregate
  #domainEvents: BookDomainEvent[] = [];

  /**
   * Private constructor to ensure Book instances are only created through the static create method
   * @param props - The validated book properties
   */
  private constructor(props: BookProps) {
    this.#id = props.id;
    this.#isbn = props.isbn;
    this.#title = props.title;
    this.#sources = props.sources;
    this.#edition = props.edition;
    this.#cover = props.cover;
    this.#year = props.year;
    this.#authors = props.authors;
    this.#description = props.description;
    this.#categories = props.categories;
    this.#tags = props.tags;
    this.#contents = props.contents;
  }

  //#region Basic Property Validations
  /**
   * Validates an ISBN string against various real-world ISBN formats
   * Supports both ISBN-10 and ISBN-13 with or without hyphens
   * @param value - The ISBN string to validate
   * @returns Either an error or void if valid
   */
  private static ValidateISBN(value: string): Either<InvalidISBNError, void> {
    // ISBN-13 format: starts with 978 or 979, exactly 13 digits
    const isbn13Regex = /^(978|979)\d{10}$/;

    // ISBN-10 format: exactly 10 characters (9 digits + check digit which can be X)
    const isbn10Regex = /^\d{9}[\dX]$/i;

    const schema = z.string().refine(
      (val) => {
        const clean = val.replace(/[-\s]/g, "");
        return isbn13Regex.test(clean) || isbn10Regex.test(clean);
      },
      { message: "Invalid ISBN format" },
    );

    return validateWithSchema(schema, value, InvalidISBNError);
  }

  /**
   * Validates that the edition number is a positive integer
   * @param value - The edition number to validate
   * @returns Either an error or void if valid
   */
  private static ValidateEdition(value: number): Either<InvalidBookEditionError, void> {
    return validateWithSchema(z.number().int().min(1), value, InvalidBookEditionError);
  }

  /**
   * Validates that the title is a non-empty string
   * @param value - The title to validate
   * @returns Either an error or void if valid
   */
  private static ValidateTitle(value: string): Either<InvalidBookTitleError, void> {
    const schema = z
      .string()
      .min(1)
      .max(500)
      .regex(/^[a-zA-Z0-9\s\-:.,!?'"()]+$/);
    return validateWithSchema(schema, value, InvalidBookTitleError);
  }

  /**
   * Validates that the cover is a valid URL
   * @param value - The cover URL to validate
   * @returns Either an error or void if valid
   */
  private static ValidateCover(value: string): Either<InvalidBookCoverError, void> {
    return validateWithSchema(z.string().url(), value, InvalidBookCoverError);
  }

  /**
   * Validates that the publication year is a reasonable integer range
   * @param value - The year to validate
   * @returns Either an error or void if valid
   */
  private static ValidateYear(value: number): Either<InvalidBookYearError, void> {
    return validateWithSchema(z.number().int().min(1450).max(3000), value, InvalidBookYearError);
  }

  /**
   * Validates that the description is a non-empty string
   * @param value - The description to validate
   * @returns Either an error or void if valid
   */
  private static ValidateDescription(value: string): Either<InvalidBookDescriptionError, void> {
    return validateWithSchema(z.string().min(1), value, InvalidBookDescriptionError);
  }

  //#endregion

  //#region Array Validations

  /**
   * Validates that all authors have non-empty names
   * @param values - The array of authors to validate
   * @returns Either an error or void if valid
   */
  private static ValidateAuthors(values: NonEmptyArray<BookAuthor>): Either<InvalidBookAuthorError, void> {
    const schema = z.object({
      names: z.string().min(1),
    });
    return validateArrayItems(values, (author) => validateWithSchema(schema, author, InvalidBookAuthorNameError));
  }

  /**
   * Validates that all categories have non-empty names
   * @param values - The array of categories to validate
   * @returns Either an error or void if valid
   */
  private static ValidateCategories(values: BookCategory[]): Either<InvalidBookCategoryError, void> {
    return validateArrayItems(values, (category) =>
      validateWithSchema(z.string().min(1), category.name, InvalidBookCategoryNameError),
    );
  }

  /**
   * Validates that all tags have non-empty names
   * @param values - The array of tags to validate
   * @returns Either an error or void if valid
   */
  private static ValidateTags(values: BookTag[]): Either<InvalidBookTagError, void> {
    return validateArrayItems(values, (tag) =>
      validateWithSchema(z.string().min(1), tag.name, InvalidBookTagNameError),
    );
  }

  /**
   * Validates that all sources have valid URLs and supported extensions
   * @param values - The array of sources to validate
   * @returns Either an error or void if valid
   */
  private static ValidateSources(
    values: NonEmptyArray<BookSource>,
  ): Either<InvalidBookSourceExtensionError | InvalidBookSourceUrlError, void> {
    return validateArrayItems(values, (source) => {
      const urlRes = validateWithSchema(z.string().url(), source.url, InvalidBookSourceUrlError);
      if (isLeft(urlRes)) return urlRes;
      const extensionRes = validateWithSchema(
        z.nativeEnum(BookExtensionsTypes),
        source.extension,
        InvalidBookSourceExtensionError,
      );
      if (isLeft(extensionRes)) return extensionRes;
      return right(undefined);
    });
  }

  /**
   * Validates that all content items (chapters and sections) have valid structure
   * @param values - The array of content items to validate
   * @returns Either an error or void if valid
   */
  private static ValidateContent(values: NonEmptyArray<BookContent>): Either<InvalidBookContentError, void> {
    return validateArrayItems(values, (content) => {
      switch (content.type) {
        case BookContentTypes.CHAPTER:
          return Book.ValidateChapter(content);
        case BookContentTypes.SECTION:
          return Book.ValidateSection(content);
        default:
          throw new Error("Unknown content type");
      }
    });
  }

  //#endregion

  //#region Content-Specific Validations

  /**
   * Validates that a chapter has a non-empty name
   * @param value - The chapter to validate
   * @returns Either an error or void if valid
   */
  private static ValidateChapter(value: BookChapter): Either<InvalidBookContentChapterNameError, void> {
    return validateWithSchema(z.string().min(1), value.name, InvalidBookContentChapterNameError);
  }

  /**
   * Validates that a section has a non-empty name and valid chapters
   * @param value - The section to validate
   * @returns Either an error or void if valid
   */
  private static ValidateSection(value: BookSection): Either<InvalidBookContentError, void> {
    const nameValidation = validateWithSchema(z.string().min(1), value.name, InvalidBookContentSectionNameError);
    if (isLeft(nameValidation)) return nameValidation;

    return validateArrayItems(value.chapters, (chapter) => Book.ValidateChapter(chapter));
  }

  //#endregion

  /**
   * Creates a new Book instance with validation of all properties
   * @param props - The book properties to create the instance with
   * @returns Either validation errors or a valid Book instance
   */
  static create(props: BookProps): Either<BookErrors, Book> {
    const isbnResp = Book.ValidateISBN(props.isbn);
    if (isLeft(isbnResp)) return isbnResp;

    const editionResp = Book.ValidateEdition(props.edition);
    if (isLeft(editionResp)) return editionResp;

    const titleResp = Book.ValidateTitle(props.title);
    if (isLeft(titleResp)) return titleResp;

    const coverResp = Book.ValidateCover(props.cover);
    if (isLeft(coverResp)) return coverResp;

    const yearResp = Book.ValidateYear(props.year);
    if (isLeft(yearResp)) return yearResp;

    const authorsResp = Book.ValidateAuthors(props.authors);
    if (isLeft(authorsResp)) return authorsResp;

    if (props.description || props.description === "") {
      const descriptionResp = Book.ValidateDescription(props.description);
      if (isLeft(descriptionResp)) return descriptionResp;
    }

    const categoriesResp = Book.ValidateCategories(props.categories);
    if (isLeft(categoriesResp)) return categoriesResp;

    const tagsResp = Book.ValidateTags(props.tags);
    if (isLeft(tagsResp)) return tagsResp;

    const sourcesResp = Book.ValidateSources(props.sources);
    if (isLeft(sourcesResp)) return sourcesResp;

    const contentResp = Book.ValidateContent(props.contents);
    if (isLeft(contentResp)) return contentResp;

    const book = new Book(props);
    book.#addDomainEvent({
      eventType: "BookCreated",
      aggregateId: book.#id,
      occurredOn: new Date(),
      bookData: {
        isbn: book.#isbn,
        title: book.#title,
        authors: book.#authors,
        year: book.#year,
      },
    });

    return right(book);
  }

  /**
   * Updates the book title after validation
   * @param value - The new title
   * @returns Either an error or void if successful
   */
  updateTitle(value: string): Either<InvalidBookTitleError, void> {
    const resp = Book.ValidateTitle(value);
    if (isLeft(resp)) return resp;

    const oldValue = this.#title;
    this.#title = value;

    this.#addDomainEvent({
      eventType: "BookMetadataUpdated",
      aggregateId: this.#id,
      occurredOn: new Date(),
      changes: [
        {
          field: "title",
          oldValue,
          newValue: value,
        },
      ],
    });

    return right(undefined);
  }

  /**
   * Updates the book ISBN after validation
   * @param value - The new ISBN
   * @returns Either an error or void if successful
   */
  updateISBN(value: string): Either<InvalidISBNError, void> {
    const resp = Book.ValidateISBN(value);
    if (isLeft(resp)) return resp;

    const oldValue = this.#isbn;
    this.#isbn = value;

    this.#addDomainEvent({
      eventType: "BookMetadataUpdated",
      aggregateId: this.#id,
      occurredOn: new Date(),
      changes: [
        {
          field: "isbn",
          oldValue,
          newValue: value,
        },
      ],
    });

    return right(undefined);
  }

  /**
   * Updates the book edition after validation
   * @param value - The new edition number
   * @returns Either an error or void if successful
   */
  updateEdition(value: number): Either<InvalidBookEditionError, void> {
    const resp = Book.ValidateEdition(value);
    if (isLeft(resp)) return resp;
    this.#edition = value;
    return right(undefined);
  }

  /**
   * Updates the book cover URL after validation
   * @param value - The new cover URL
   * @returns Either an error or void if successful
   */
  updateCover(value: string): Either<InvalidBookCoverError, void> {
    const resp = Book.ValidateCover(value);
    if (isLeft(resp)) return resp;
    this.#cover = value;
    return right(undefined);
  }

  /**
   * Updates the book publication year after validation
   * @param value - The new publication year
   * @returns Either an error or void if successful
   */
  updateYear(value: number): Either<InvalidBookYearError, void> {
    const resp = Book.ValidateYear(value);
    if (isLeft(resp)) return resp;
    this.#year = value;
    return right(undefined);
  }

  /**
   * Updates the book authors after validation
   * @param values - The new array of authors
   * @returns Either an error or void if successful
   */
  updateAuthors(values: NonEmptyArray<BookAuthor>): Either<InvalidBookAuthorError, void> {
    const resp = Book.ValidateAuthors(values);
    if (isLeft(resp)) return resp;
    this.#authors = values;
    return right(undefined);
  }

  /**
   * Updates the book description after validation
   * @param value - The new description
   * @returns Either an error or void if successful
   */
  updateDescription(value: string): Either<InvalidBookDescriptionError, void> {
    const resp = Book.ValidateDescription(value);
    if (isLeft(resp)) return resp;
    this.#description = value;
    return right(undefined);
  }

  /**
   * Updates the book categories after validation
   * @param values - The new array of categories
   * @returns Either an error or void if successful
   */
  updateCategories(values: BookCategory[]): Either<InvalidBookCategoryError, void> {
    const resp = Book.ValidateCategories(values);
    if (isLeft(resp)) return resp;
    this.#categories = values;
    return right(undefined);
  }

  /**
   * Updates the book tags after validation
   * @param values - The new array of tags
   * @returns Either an error or void if successful
   */
  updateTags(values: BookTag[]): Either<InvalidBookTagError, void> {
    const resp = Book.ValidateTags(values);
    if (isLeft(resp)) return resp;
    this.#tags = values;
    return right(undefined);
  }

  /**
   * Updates the book sources after validation
   * @param values - The new array of sources
   * @returns Either an error or void if successful
   */
  updateSources(
    values: NonEmptyArray<BookSource>,
  ): Either<InvalidBookSourceExtensionError | InvalidBookSourceUrlError, void> {
    const resp = Book.ValidateSources(values);
    if (isLeft(resp)) return resp;

    const oldSources = [...this.#sources];
    this.#sources = values;

    // Calculate added and removed sources
    const added = values.filter(
      (newSource) =>
        !oldSources.some((oldSource) => oldSource.url === newSource.url && oldSource.extension === newSource.extension),
    );

    const removed = oldSources.filter(
      (oldSource) =>
        !values.some((newSource) => oldSource.url === newSource.url && oldSource.extension === newSource.extension),
    );

    if (added.length > 0 || removed.length > 0) {
      this.#addDomainEvent({
        eventType: "BookSourcesUpdated",
        aggregateId: this.#id,
        occurredOn: new Date(),
        sourceChanges: {
          added,
          removed,
        },
      });
    }

    return right(undefined);
  }

  /**
   * Updates the book content (chapters and sections) after validation
   * @param values - The new array of content items
   * @returns Either an error or void if successful
   */
  updateContent(values: NonEmptyArray<BookContent>): Either<InvalidBookContentError, void> {
    const resp = Book.ValidateContent(values);
    if (isLeft(resp)) return resp;

    // Calculate content changes
    const oldChapters = this.#contents.filter((c) => c.type === BookContentTypes.CHAPTER).length;
    const oldSections = this.#contents.filter((c) => c.type === BookContentTypes.SECTION).length;

    const newChapters = values.filter((c) => c.type === BookContentTypes.CHAPTER).length;
    const newSections = values.filter((c) => c.type === BookContentTypes.SECTION).length;

    this.#contents = values;

    const contentChanges = {
      addedChapters: Math.max(0, newChapters - oldChapters),
      removedChapters: Math.max(0, oldChapters - newChapters),
      addedSections: Math.max(0, newSections - oldSections),
      removedSections: Math.max(0, oldSections - newSections),
    };

    // Only fire event if there are actual changes
    if (
      contentChanges.addedChapters > 0 ||
      contentChanges.removedChapters > 0 ||
      contentChanges.addedSections > 0 ||
      contentChanges.removedSections > 0
    ) {
      this.#addDomainEvent({
        eventType: "BookContentUpdated",
        aggregateId: this.#id,
        occurredOn: new Date(),
        contentChanges,
      });
    }

    return right(undefined);
  }

  /**
   * Gets the unique identifier of the book
   * @returns The book's ID
   */
  get id() {
    return this.#id;
  }

  /**
   * Gets the ISBN of the book
   * @returns The book's ISBN
   */
  get isbn() {
    return this.#isbn;
  }

  /**
   * Gets the edition number of the book
   * @returns The book's edition number
   */
  get edition() {
    return this.#edition;
  }

  /**
   * Gets the title of the book
   * @returns The book's title
   */
  get title() {
    return this.#title;
  }

  /**
   * Gets the cover URL of the book
   * @returns The book's cover URL
   */
  get cover() {
    return this.#cover;
  }

  /**
   * Gets the publication year of the book
   * @returns The book's publication year
   */
  get year() {
    return this.#year;
  }

  /**
   * Gets the authors of the book
   * @returns The book's authors array
   */
  get authors() {
    return this.#authors;
  }

  /**
   * Gets the description of the book
   * @returns The book's description or undefined
   */
  get description() {
    return this.#description;
  }

  /**
   * Gets the categories of the book
   * @returns The book's categories array
   */
  get categories() {
    return this.#categories;
  }

  /**
   * Gets the tags of the book
   * @returns The book's tags array
   */
  get tags() {
    return this.#tags;
  }

  /**
   * Gets the content structure of the book (chapters and sections)
   * @returns The book's content array
   */
  get contents() {
    return this.#contents;
  }

  /**
   * Gets the sources where the book can be accessed
   * @returns The book's sources array
   */
  get sources() {
    return this.#sources;
  }

  //#region Domain Events

  /**
   * Gets all domain events that have occurred on this aggregate
   * @returns Array of domain events
   */
  getDomainEvents(): readonly BookDomainEvent[] {
    return [...this.#domainEvents];
  }

  /**
   * Clears all domain events from this aggregate
   * This is typically called after events have been published
   */
  clearDomainEvents(): void {
    this.#domainEvents = [];
  }

  /**
   * Adds a domain event to the aggregate
   * @param event - The domain event to add
   */
  #addDomainEvent(event: BookDomainEvent): void {
    this.#domainEvents.push(event);
  }

  //#endregion
}

//#region books
