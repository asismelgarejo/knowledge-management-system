import { validateArrayItems, validateWithSchema } from "@/shared/utils";
import { Either, isLeft, right } from "fp-ts/Either";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";
import z from "zod";
import { BookContentTypes, BookValidationConstants } from "../constants/book.constants";
import {
  BookAuthor,
  BookCategory,
  BookChapter,
  BookContent,
  BookExtensionsTypes,
  BookSection,
  BookSource,
  BookTag,
} from "../entities/book";
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
} from "../errors/errors";

export class BookValidationService {
  static validateISBN(value: string): Either<InvalidISBNError, void> {
    const isbn13Regex = /^(978|979)\d{10}$/;
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

  static validateEdition(value: number): Either<InvalidBookEditionError, void> {
   
  }

  static validateTitle(value: string): Either<InvalidBookTitleError, void> {
    const schema = z
      .string()
      .min(1)
      .max(BookValidationConstants.TITLE.MAX_LENGTH)
      .regex(/^[a-zA-Z0-9\s\-:.,!?'"()]+$/);
    return validateWithSchema(schema, value, InvalidBookTitleError);
  }

  static validateCover(value: string): Either<InvalidBookCoverError, void> {
    return validateWithSchema(z.string().url(), value, InvalidBookCoverError);
  }

  static validateDescription(value: string): Either<InvalidBookDescriptionError, void> {
    return validateWithSchema(
      z.string().min(BookValidationConstants.DESCRIPTION.MIN_LENGTH),
      value,
      InvalidBookDescriptionError,
    );
  }

  static validateSources(
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

  static validateContent(values: NonEmptyArray<BookContent>): Either<InvalidBookContentError, void> {
    return validateArrayItems(values, (content) => {
      switch (content.type) {
        case BookContentTypes.CHAPTER:
          return BookValidationService.validateChapter(content);
        case BookContentTypes.SECTION:
          return BookValidationService.validateSection(content);
        default:
          throw new Error("Unknown content type");
      }
    });
  }

  private static validateSection(value: BookSection): Either<InvalidBookContentError, void> {
    const nameValidation = validateWithSchema(z.string().min(1), value.name, InvalidBookContentSectionNameError);
    if (isLeft(nameValidation)) return nameValidation;

    return validateArrayItems(value.chapters, (chapter) => BookValidationService.validateChapter(chapter));
  }
}
