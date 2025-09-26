import { logger } from "@/shared/observability/logger";
import { Brand } from "@/shared/value-objects";
import z from "zod";
import { InvalidAuthorFullNameError } from "../errors";

// ---- Branded type ----
export type AuthorFullName = Brand<string, "AuthorFullName">;

// ---- Normalization ----
const normalizeFullName = (raw: string): string => {
  return raw.normalize("NFKC").trim().replace(/\s+/g, " ");
};

// ---- Zod schema ----
// Allows multilingual names with diacritics and common punctuation.
const authorFullNameSchema = z
  .string()
  .transform(normalizeFullName)
  .refine((s) => s.length >= 2, { message: "Name too short" })
  .refine((s) => s.length <= 160, { message: "Name too long" })
  .refine((s) => /\p{L}/u.test(s), { message: "Name must contain letters" })
  .refine((s) => !/[.'-]{3,}/.test(s), { message: "Punctuation sequence not allowed" });

export const AuthorFullName = {
  make: (raw: string): AuthorFullName => {
    const result = authorFullNameSchema.safeParse(raw);
    if (!result.success) {
      logger.error("Invalid author full name", { raw, issues: result.error.issues });
      throw new InvalidAuthorFullNameError(raw);
    }
    return result.data as AuthorFullName;
  },
};
