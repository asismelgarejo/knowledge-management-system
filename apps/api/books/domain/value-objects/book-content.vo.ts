import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";

import { Id } from "@/shared/utils";
import { BookContentTypes } from "../constants";
import { InvalidBookContentError, InvalidBookContentIsEmptyError } from "../errors/errors";
import { BookChapter } from "./book-chapter.vo";
import { BookSection } from "./book-section.vo";

// Validated union (output)
export type BookContent = BookSection | BookChapter;

// Raw, unvalidated input (DTO)
type BookContentInput =
  | { type: BookContentTypes.CHAPTER; id: string; name: string }
  | {
      type: BookContentTypes.SECTION;
      id: string;
      name: string;
      chapters: ReadonlyArray<{ id: string; name: string }>;
    };

export const BookContent = {
  make: (
    values: ReadonlyArray<BookContentInput>,
  ): E.Either<InvalidBookContentError, NonEmptyArray<Readonly<BookContent>>> => {
    if (values.length === 0) {
      return E.left(new InvalidBookContentIsEmptyError("Content must be non-empty"));
    }

    const validate = (input: BookContentInput): E.Either<InvalidBookContentError, BookContent> => {
      switch (input.type) {
        case BookContentTypes.CHAPTER:
          // BookChapter.make should enforce CHAPTER type internally
          return BookChapter.make({ id: Id.create(input.id), name: input.name });
        case BookContentTypes.SECTION:
          return BookSection.make({
            id: Id.create(input.id),
            name: input.name,
            chapters: input.chapters.map((ch) => ({ id: Id.create(ch.id), name: ch.name })),
          });
      }
      // Exhaustiveness guard (if enum grows, TS will flag this)
      // const _exhaustive: never = input
      // return _exhaustive
    };

    return pipe(
      values,
      A.traverse(E.Applicative)(validate),
      // safe cast because traverse preserves length and we checked non-empty above
      E.map((arr) => arr as NonEmptyArray<BookContent>),
    );
  },
};
