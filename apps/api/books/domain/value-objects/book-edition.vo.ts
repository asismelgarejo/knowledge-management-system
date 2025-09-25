import { Brand, validateWithSchema } from "@/shared/utils";
import * as E from "fp-ts/Either";
import z from "zod";
import { BookValidationConstants } from "../constants";
import { InvalidBookEditionError } from "../errors/errors";
export type BookEdition = Brand<number, "BookEdition">;
export const BookEdition = {
  make: (value: number): E.Either<InvalidBookEditionError, BookEdition> => {
    return validateWithSchema(
      z.number().int().min(BookValidationConstants.EDITION.MIN),
      value,
      InvalidBookEditionError,
    ) as E.Either<InvalidBookEditionError, BookEdition>;
  },
};
