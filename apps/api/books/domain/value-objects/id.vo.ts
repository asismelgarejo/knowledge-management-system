import { ObjectId } from "mongodb";

/**
 * Represents a unique identifier in the domain.
 *
 * This is a **Value Object** that wraps a MongoDB `ObjectId`.
 * It is used as a generic identity type across entities (e.g., Book, Author).
 *
 * Characteristics:
 * - **Immutable**: once created, the internal `ObjectId` never changes.
 * - **Equality by value**: two `Id` instances are equal if their hex string values match.
 * - **Encapsulation**: prevents leaking raw strings or `ObjectId`s throughout the domain.
 */
export class Id {
  /** Underlying MongoDB ObjectId (immutable). */
  private readonly value: ObjectId;

  /**
   * Private constructor to enforce factory usage.
   *
   * @param value - A valid `ObjectId` instance.
   */
  private constructor(value: ObjectId) {
    this.value = value;
  }

  /**
   * Creates a new `Id` value object.
   *
   * @remarks
   * - If no `value` is provided, a fresh `ObjectId` is generated.
   * - If a string is provided, it must be a valid `ObjectId` hex string.
   *
   * @param value - Optional 24-character hex string representing an ObjectId.
   * @throws {Error} If `value` is provided but is not a valid `ObjectId`.
   * @returns A new `Id` instance.
   */
  static create(value?: string): Id {
    if (!value) return new Id(new ObjectId());
    if (!ObjectId.isValid(value)) {
      throw new Error(`Invalid ObjectId: "${value}"`);
    }
    return new Id(new ObjectId(value));
  }

  /**
   * Gets the underlying `ObjectId` instance.
   *
   * @remarks
   * This property should only be used at infrastructure boundaries
   * (e.g., persistence or external APIs). Use `toString()` or `toPrimitives()`
   * in the application/domain layer to avoid coupling with Mongo internals.
   */
  get raw(): ObjectId {
    return this.value;
  }

  /**
   * Returns the canonical string (24-character hex) representation of the ID.
   *
   * @returns Hex string of the underlying `ObjectId`.
   */
  toString(): string {
    return this.value.toHexString();
  }

  /**
   * Checks equality by comparing the string representations of two IDs.
   *
   * @param other - Another `Id` instance.
   * @returns `true` if both IDs represent the same underlying value; otherwise, `false`.
   */
  equals(other: Id): boolean {
    return this.toString() === other.toString();
  }

  /**
   * Converts the ID to a primitive type suitable for persistence or serialization.
   *
   * @remarks
   * Typically used in repositories, DTOs, or JSON responses.
   *
   * @returns Hex string representation of the ID.
   */
  toPrimitives(): string {
    return this.toString();
  }
}
