/**
 * Error thrown when attempting to create a {@link BookAuthors} collection with no authors.
 */
export class EmptyBookAuthorsError extends Error {
  /** Machine-readable error code (class name without "Error"). */
  static readonly CODE = "EmptyBookAuthors";
  /** Instance error code. */
  readonly code = EmptyBookAuthorsError.CODE;

  /** Default human-readable message. */
  private static readonly MESSAGE = "A book must have at least one author";

  /**
   * Creates a new {@link EmptyBookAuthorsError}.
   *
   * @remarks
   * Raised when a `BookAuthors` collection is created without any authors.
   */
  constructor() {
    super(EmptyBookAuthorsError.MESSAGE);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when a duplicate author ID is found in a {@link BookAuthors} collection.
 */
export class DuplicateBookAuthorError extends Error {
  /** Machine-readable error code (class name without "Error"). */
  static readonly CODE = "DuplicateBookAuthor";

  /** Instance error code. */
  readonly code = DuplicateBookAuthorError.CODE;

  /** The author ID that was found duplicated (string form). */
  readonly authorId: string;

  /** Default human-readable message fragment. */
  private static readonly MESSAGE = "Duplicate author detected in the book's author list:";

  /**
   * Creates a new {@link DuplicateBookAuthorError}.
   *
   * @param authorId - The string ID of the author that already exists in the collection.
   *
   * @remarks
   * Raised when the same author ID is added more than once to a `BookAuthors` collection.
   * The duplicated ID is included for easier debugging, logging, or API responses.
   */
  constructor(authorId: string) {
    super(`${DuplicateBookAuthorError.MESSAGE} ${authorId}`);
    this.authorId = authorId;
    this.name = DuplicateBookAuthorError.CODE;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when the number of authors exceeds the allowed maximum.
 */
export class BookAuthorsLimitExceededError extends Error {
  /** Machine-readable error code (class name without "Error"). */
  static readonly CODE = "BookAuthorsLimitExceeded";
  /** Instance error code. */
  readonly code = BookAuthorsLimitExceededError.CODE;

  /** Static fragment of the error message. */
  private static readonly MESSAGE_FRAGMENT = "A book cannot have more than";

  /**
   * Creates a new {@link BookAuthorsLimitExceededError}.
   *
   * @param max - The maximum number of authors allowed for a book.
   *
   * @remarks
   * Raised when a `BookAuthors` collection is created or mutated such that it
   * contains more than the permitted number of authors.
   */
  constructor(public readonly max: number) {
    super(`${BookAuthorsLimitExceededError.MESSAGE_FRAGMENT} ${max} authors`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when an author's name is invalid.
 */
export class InvalidAuthorFullNameError extends Error {
  /** Machine-readable error code (class name without "Error"). */
  static readonly CODE = "InvalidAuthorFullName";

  /** Instance error code. */
  readonly code = InvalidAuthorFullNameError.CODE;

  /** The invalid name value (raw string). */
  readonly value: string;

  /** Default human-readable message fragment. */
  private static readonly MESSAGE = "Invalid author name provided:";

  /**
   * Creates a new {@link InvalidAuthorFullNameError}.
   *
   * @param value - The raw string value that failed validation.
   *
   * @remarks
   * Raised when the provided author name does not meet the domain's
   * invariants (e.g. too short, too long, or containing invalid characters).
   *
   * The invalid input value is preserved in {@link value} for logging,
   * debugging, or API responses.
   */
  constructor(value: string) {
    super(`${InvalidAuthorFullNameError.MESSAGE} "${value}"`);
    this.value = value;
    this.name = InvalidAuthorFullNameError.CODE;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error thrown when a book title is invalid.
 */
export class InvalidBookTitleError extends Error {
  /** Machine-readable error code (class name without "Error"). */
  static readonly CODE = "InvalidBookTitle";

  /** Instance error code. */
  readonly code = InvalidBookTitleError.CODE;

  /** The invalid title value (raw string). */
  readonly value: string;

  /** Default human-readable message fragment. */
  private static readonly MESSAGE = "Invalid book title provided:";

  /**
   * Creates a new {@link InvalidBookTitleError}.
   *
   * @param value - The raw string value that failed validation.
   *
   * @remarks
   * Raised when the provided book title does not meet the domain's
   * invariants (e.g., empty, too long, or containing invalid characters).
   *
   * The invalid input value is preserved in {@link value} for logging,
   * debugging, or API responses.
   */
  constructor(value: string) {
    super(`${InvalidBookTitleError.MESSAGE} "${value}"`);
    this.value = value;
    this.name = InvalidBookTitleError.CODE;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
