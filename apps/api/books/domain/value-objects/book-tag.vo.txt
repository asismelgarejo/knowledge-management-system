import { Brand, Id, validateWithSchema } from "@/shared/utils";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import z from "zod";
import { InvalidBookTagError, InvalidBookTagNameError } from "../errors/errors";

export type BookTagName = Brand<string, "BookTagName">;
export const BookTagName = {
  make: (value: string): E.Either<InvalidBookTagNameError, BookTagName> => {
    return validateWithSchema(z.string().min(1), value as BookTagName, InvalidBookTagNameError) as E.Either<
      InvalidBookTagNameError,
      BookTagName
    >;
  },
};
export type BookTag = { id: Id; name: BookTagName };
export const BookTag = {
  make: (input: { id: Id; name: string }): E.Either<InvalidBookTagError, Readonly<BookTag>> =>
    pipe(
      BookTagName.make(input.name),
      E.map((name) => ({ id: input.id, name })),
    ),
};
