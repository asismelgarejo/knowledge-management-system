import { Brand, validateWithSchema, ValueObject } from "@/shared/utils";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import z from "zod";
import { InvalidAuthorFullNameError } from "../errors/errors";

/**
 * Why a dedicated VO even for a single string?
 * - Centralize normalization (trim, collapse spaces, Unicode normalization).
 * - Enforce invariants (length, allowed characters).
 * - Stable equality (two inputs that normalize the same are equal).
 */

type AuthorFullNameString = Brand<string, "AuthorFullName">;

type AuthorFullNameProps = {
  readonly value: AuthorFullNameString;
};

const normalizeFullName = (raw: string): string => {
  // 1) Unicode normalize (avoid visually different but canonically same strings)
  // 2) Trim edges
  // 3) Collapse inner whitespace
  return raw.normalize("NFKC").trim().replace(/\s+/g, " ");
};

// Allow letters from any script + combining marks, and common name punctuation.
// Examples allowed: "Gabriel García Márquez", "Jean-Luc Picard", "O'Connor", "J. R. R. Tolkien"
const authorFullNameSchema = z
  .string()
  .transform(normalizeFullName)
  .refine((s) => s.length >= 2, { message: "Name too short" })
  .refine((s) => s.length <= 160, { message: "Name too long" })
  // Must contain at least one letter
  .refine((s) => /\p{L}/u.test(s), { message: "Name must contain letters" })
  // Only letters, marks, spaces, apostrophes, hyphens, dots (periods)
  .refine((s) => /^[\p{L}\p{M}\s'.-]+$/u.test(s), { message: "Invalid characters in name" })
  // Avoid things like "....", "--", "''" sequences
  .refine((s) => !/[.'-]{3,}/.test(s), { message: "Punctuation sequence not allowed" });

export class AuthorFullName extends ValueObject<AuthorFullNameProps> {
  private constructor(props: AuthorFullNameProps) {
    super(props);
  }

  static create(raw: string): E.Either<InvalidAuthorFullNameError, AuthorFullName> {
    return pipe(
      validateWithSchema(authorFullNameSchema, raw, InvalidAuthorFullNameError),
      E.map((v) => v as AuthorFullNameString),
      E.map((value) => new AuthorFullName({ value })),
    );
  }

  value(): string {
    return this.props.value;
  }

  toPrimitives(): string {
    return this.props.value;
  }
}
