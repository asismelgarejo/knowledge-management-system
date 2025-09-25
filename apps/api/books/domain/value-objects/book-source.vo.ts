import { Brand, validateWithSchema } from "@/shared/utils";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import z from "zod";
import { BookExtensionsTypes } from "../constants";
import { InvalidBookSourceError, InvalidBookSourceExtensionError, InvalidBookSourceUrlError } from "../errors/errors";

export type BookSourceUrl = Brand<string, "BookSourceUrl">;
export const BookSourceUrl = {
  make: (value: string): E.Either<InvalidBookSourceUrlError, BookSourceUrl> => {
    return validateWithSchema(z.string().url(), value, InvalidBookSourceUrlError) as E.Either<
      InvalidBookSourceUrlError,
      BookSourceUrl
    >;
  },
};

export type BookSourceExtension = Brand<string, "BookSourceExtension">;
export const BookSourceExtension = {
  make: (value: string): E.Either<InvalidBookSourceExtensionError, BookSourceExtension> => {
    return validateWithSchema(z.nativeEnum(BookExtensionsTypes), value, InvalidBookSourceExtensionError) as E.Either<
      InvalidBookSourceExtensionError,
      BookSourceExtension
    >;
  },
};

export type BookSource = { url: BookSourceUrl; extension: BookSourceExtension };
export const BookSource = {
  make: (input: BookSource): E.Either<InvalidBookSourceError, BookSource> =>
    pipe(
      BookSourceUrl.make(input.url),
      E.flatMap((url) =>
        pipe(
          BookSourceExtension.make(input.extension),
          E.map((extension) => ({ url, extension })),
        ),
      ),
    ),
};
