import { Brand, validateWithSchema } from "@/shared/utils";
import * as E from "fp-ts/Either";
import z from "zod";
import { BookValidationConstants } from "../constants";
import { InvalidBookYearError } from "../errors/errors";
export type BookYear = Brand<number, "BookYear">;
export const BookYear = {
  make: (value: number): E.Either<InvalidBookYearError, BookYear> => {
    return validateWithSchema(
      z.number().int().min(BookValidationConstants.YEAR.MIN).max(BookValidationConstants.YEAR.MAX),
      value,
      InvalidBookYearError,
    ) as E.Either<InvalidBookYearError, BookYear>;
  },
};
