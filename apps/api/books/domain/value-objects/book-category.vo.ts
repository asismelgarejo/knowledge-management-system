import { Brand, Id, validateWithSchema } from "@/shared/utils";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import z from "zod";
import { InvalidBookCategoryError, InvalidBookCategoryNameError } from "../errors/errors";

export type BookCategoryName = Brand<string, "BookCategoryName">;

export const BookCategoryName = {
  make: (value: string): E.Either<InvalidBookCategoryNameError, BookCategoryName> =>
    pipe(
      validateWithSchema(z.string().trim().min(1), value, InvalidBookCategoryNameError),
      E.map((v) => v as BookCategoryName),
    ),
};

export type BookCategory = Readonly<{ id: Id; name: BookCategoryName }>;

export const BookCategory = {
  make: (input: { id: Id; name: string }): E.Either<InvalidBookCategoryError, BookCategory> =>
    pipe(
      BookCategoryName.make(input.name),
      E.mapLeft((e) => e),
      E.map((name) => ({ id: input.id, name })),
    ),
};
