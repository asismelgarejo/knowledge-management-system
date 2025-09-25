import * as E from "fp-ts/Either";
import { z } from "zod";

/**
 * Formats Zod issues into a compact single-line message.
 */
const formatZodIssues = (issues: z.ZodIssue[]): string =>
  issues
    .map((i) => {
      const path = i.path.join(".") || "(root)";
      return `${path}: ${i.message}`;
    })
    .join("; ");

/**
 * Validate a value with a Zod schema and return an fp-ts Either.
 *
 * - On success: Right<ParsedValue>
 * - On failure: Left<CustomError>
 *
 * @param schema     Zod schema to validate against.
 * @param value      Unknown input to validate.
 * @param ErrorCtor  Custom error constructor (e.g., InvalidBookTitleError).
 *                   It will be instantiated with a single string message.
 */
export function validateWithSchema<A, Err extends Error>(
  schema: z.ZodType<A>,
  value: unknown,
  ErrorCtor: new (message: string) => Err,
): E.Either<Err, A> {
  const result = schema.safeParse(value);

  if (result.success) {
    // Parsed value conforms to A
    return E.right(result.data);
  }

  // Build a meaningful message from Zod issues
  const details = formatZodIssues(result.error.issues);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msg = (ErrorCtor as any)?.MESSAGE // support custom static MESSAGE fields if present
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      `${(ErrorCtor as any).MESSAGE} ${details}`
    : details;

  return E.left(new ErrorCtor(msg));
}
