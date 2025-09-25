import { Brand, Id, validateWithSchema } from "@/shared/utils";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import z from "zod";
import { BookContentTypes } from "../constants";
import { InvalidBookContentChapterNameError } from "../errors/errors";

// ---------- Value Object: ChapterName ----------
export type ChapterName = Brand<string, "ChapterName">;

export const ChapterName = {
  make: (value: string): E.Either<InvalidBookContentChapterNameError, ChapterName> =>
    pipe(
      validateWithSchema(z.string().trim().min(1), value, InvalidBookContentChapterNameError),
      E.map((v) => v as ChapterName),
    ),
};

// ---------- Aggregate VO: BookChapter ----------
export type BookChapter = Readonly<{
  id: Id;
  name: ChapterName;
  type: BookContentTypes.CHAPTER;
}>;

export type BookChapterInput = { id: Id; name: string };

export const BookChapter = {
  make: (input: BookChapterInput): E.Either<InvalidBookContentChapterNameError, BookChapter> =>
    pipe(
      ChapterName.make(input.name),
      E.map((name) => ({
        id: input.id,
        name,
        type: BookContentTypes.CHAPTER,
      })),
    ),
};
