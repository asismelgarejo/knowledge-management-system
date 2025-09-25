import { validateWithSchema } from "@/shared/utils";
import * as E from "fp-ts/Either";
import z from "zod";
import { BookValidationConstants } from "../constants";
import { InvalidBookTitleError } from "../errors";

type Brand<T, B extends string> = T & { readonly __brand: B };

export type BookTitle = Brand<string, "BookTitle">;
export const BookTitle = {
  make: (value: string): E.Either<InvalidBookTitleError, BookTitle> => {
    const schema = z
      .string()
      .min(1)
      .max(BookValidationConstants.TITLE.MAX_LENGTH)
      .regex(/^[a-zA-Z0-9\s\-:.,!?'"()]+$/);

    return validateWithSchema(schema, value, InvalidBookTitleError) as E.Either<InvalidBookTitleError, BookTitle>;
  },
};
