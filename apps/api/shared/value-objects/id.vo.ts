import { Brand } from "@/shared/value-objects";
import { ObjectId } from "mongodb";

/**
 * Branded type for domain IDs.
 * Wraps a MongoDB ObjectId but keeps it as a string in the domain.
 */
export type Id = Brand<string, "Id">;

export const Id = {
  /** Create a new Id (generates a new ObjectId if no value is provided). */
  make: (value?: string): Id => {
    if (!value) {
      return new ObjectId().toHexString() as Id;
    }
    if (!ObjectId.isValid(value)) {
      throw new Error(`Invalid ObjectId: "${value}"`);
    }
    return new ObjectId(value).toString() as Id;
  },

  /** Return the canonical string representation (24-char hex). */
  toString: (id: Id): string => id,

  /** Convert to primitive string (for persistence/DTOs). */
  toPrimitives: (id: Id): string => id,

  /** Reconstruct from a stored primitive string. */
  fromPrimitives: (value: ObjectId): Id => {
    return new ObjectId(value.toString()).toHexString() as Id;
  },

  /** Equality check. */
  equals: (a: Id, b: Id): boolean => a === b,

  /** Expose raw Mongo ObjectId (for infra boundaries only). */
  value: (id: Id): ObjectId => new ObjectId(id),
};
