import { DomainEvent, Id } from "@/shared/utils";
import { Either } from "fp-ts/lib/Either";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";
import { BookValidationService } from "../services/book-validation.service";
import { BookAuthor, BookCategory, BookContent, BookSource, BookTag } from "../value-objects";
import {
  InvalidBookAuthorError,
  InvalidBookCategoryError,
  InvalidBookContentError,
  InvalidBookCoverError,
  InvalidBookDescriptionError,
  InvalidBookEditionError,
  InvalidBookSourceExtensionError,
  InvalidBookSourceUrlError,
  InvalidBookTagError,
  InvalidBookTitleError,
  InvalidBookYearError,
  InvalidISBNError,
} from "../errors/errors";
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

/**
 * Properties required to create a BookBase instance
 */
export type BookBaseProps = {
  /** Unique identifier for the book */
  id: Id;
  /** International Standard BookBase Number */
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
 * Union type of all possible validation errors that can occur when creating or updating a BookBase
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

export class BookBase {
  // Unique identifier for the book - immutable once set
  readonly #id: Id;
  // International Standard BookBase Number - unique book identifier
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
   * Private constructor to ensure BookBase instances are only created through the static create method
   * @param props - The validated book properties
   */
  private constructor(props: BookBaseProps) {
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

  static create(props: BookBaseProps): Either<BookErrors, BookBase> {
    
  }

  /**
   * Updates the book title after validation
   * @param value - The new title
   * @returns Either an error or void if successful
   */
  updateTitle(value: string): Either<InvalidBookTitleError, void> {
    const resp = BookValidationService.validateTitle(value);
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
    const resp = BookValidationService.validateISBN(value);
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
    const resp = BookValidationService.validateEdition(value);
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
    const resp = BookValidationService.validateCover(value);
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
    const resp = BookValidationService.validateYear(value);
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
    const resp = BookValidationService.validateAuthors(values);
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
    const resp = BookValidationService.validateDescription(value);
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
    const resp = BookValidationService.validateCategories(values);
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
    const resp = BookValidationService.validateTags(values);
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
    const resp = BookValidationService.validateSources(values);
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
    const resp = BookValidationService.validateContent(values);
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
