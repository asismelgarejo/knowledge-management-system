import { Brand } from "@/shared/value-objects";
import z from "zod";
import { BookValidationConstants } from "../constants";
import { InvalidBookTitleError } from "../errors";

export type BookTitle = Brand<string, "BookTitle">;
const schema = z
  .string()
  .min(1)
  .max(BookValidationConstants.TITLE.MAX_LENGTH)
  .regex(/^[a-zA-Z0-9\s\-:.,!?'"()]+$/);
export const BookTitle = {
  make: (value: string): BookTitle => {
    const result = schema.safeParse(value);
    if (!result.success) {
      throw new InvalidBookTitleError(value);
    }
    return result.data as BookTitle;
  },
};
