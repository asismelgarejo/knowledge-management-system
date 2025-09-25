export const BookValidationConstants = {
  YEAR: {
    MIN: 1450,
    MAX: 3000,
  },
  TITLE: {
    MAX_LENGTH: 500,
  },
  DESCRIPTION: {
    MIN_LENGTH: 1,
  },
  EDITION: {
    MIN: 1,
  },
} as const;

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
/**
 * Supported file extensions for book sources
 */
export enum BookExtensionsTypes {
  /** PDF document format */
  pdf = "pdf",
  /** EPUB electronic publication format */
  epub = "epub",
}
