// src/books/domain/book-validation.service.ts
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import {
  BookEdition,
  BookSourceExtension,
  BookSourceUrl,
  BookTitle,
  BookYear,
  BookAuthor as VOBookAuthor,
  BookCategory as VOBookCategory,
  BookChapter as VOBookChapter,
  BookContent as VOBookContent,
  BookSection as VOBookSection,
  BookTag as VOBookTag,
} from "../value-objects";

// Keep the same exported name and method signatures you already use.
// Each returns Either<DomainError, void> for drop-in compatibility.
export class BookValidationService {
  static validateTitle(value: string) {
    return pipe(
      BookTitle.make(value),
      E.map(() => undefined),
    );
  }
  static validateYear(value: number) {
    return pipe(
      BookYear.make(value),
      E.map(() => undefined),
    );
  }
  static validateEdition(value: number) {
    return pipe(
      BookEdition.make(value),
      E.map(() => undefined),
    );
  }

  static validateAuthor(value: { id: string; names: string }) {
    return pipe(
      VOBookAuthor.make(value),
      E.map(() => undefined),
    );
  }
  static validateTag(value: { id: string; name: string }) {
    return pipe(
      VOBookTag.make(value),
      E.map(() => undefined),
    );
  }
  static validateCategory(value: { id: string; name: string }) {
    return pipe(
      VOBookCategory.make(value),
      E.map(() => undefined),
    );
  }

  static validateSourceUrl(url: string) {
    return pipe(
      BookSourceUrl.make(url),
      E.map(() => undefined),
    );
  }
  static validateSourceExtension(ext: string) {
    return pipe(
      BookSourceExtension.make(ext),
      E.map(() => undefined),
    );
  }

  // Content
  static validateContent(value: {
    type: string;
    sections: ReadonlyArray<{ id: string; name: string; chapters: ReadonlyArray<{ id: string; name: string }> }>;
  }) {
    return pipe(
      VOBookContent.make(value),
      E.map(() => undefined),
    );
  }
  static validateSection(value: { id: string; name: string; chapters: ReadonlyArray<{ id: string; name: string }> }) {
    return pipe(
      VOBookSection.make(value),
      E.map(() => undefined),
    );
  }
  static validateChapter(value: { id: string; name: string }) {
    return pipe(
      VOBookChapter.make(value),
      E.map(() => undefined),
    );
  }
}
