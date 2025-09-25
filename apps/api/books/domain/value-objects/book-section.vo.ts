import { Brand, Id, validateWithSchema } from "@/shared/utils";
import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";
import z from "zod";

import { BookContentTypes } from "../constants";
import {
  InvalidBookContentError,
  InvalidBookContentIsEmptyError,
  InvalidBookContentSectionNameError,
} from "../errors/errors";
import { BookChapter } from "./book-chapter.vo";

// ─────────────────────────────────────────────────────────────
// SectionName VO
// ─────────────────────────────────────────────────────────────
export type SectionName = Brand<string, "SectionName">;

export const SectionName = {
  make: (value: string): E.Either<InvalidBookContentSectionNameError, SectionName> => {
    return pipe(
      validateWithSchema(z.string().min(1), value, InvalidBookContentSectionNameError),
      E.map((v) => v as SectionName),
    );
  },
};

export type BookSection = Readonly<{
  id: Id;
  name: SectionName;
  chapters: NonEmptyArray<BookChapter>;
  type: BookContentTypes.SECTION;
}>;

// Raw DTO the constructor accepts
export type BookSectionInput = Readonly<{
  id: Id;
  name: string;
  chapters: { id: Id; name: string }[];
}>;

export const BookSection = {
  make: (input: BookSectionInput): E.Either<InvalidBookContentError, BookSection> => {
    if (input.chapters.length === 0) {
      return E.left(new InvalidBookContentIsEmptyError("Section must contain at least one chapter"));
    }
    return pipe(
      SectionName.make(input.name),
      E.bind("chapters", () =>
        pipe(
          input.chapters,
          A.traverse(E.Applicative)((ch) => BookChapter.make({ id: ch.id, name: ch.name })),
          E.map((chs) => chs as NonEmptyArray<BookChapter>), // safe: length preserved and checked above
        ),
      ),
      E.map(({ name, chapters }) => ({
        id: input.id,
        name,
        chapters,
        type: BookContentTypes.SECTION, // enforce here
      })),
    );
  },
};
