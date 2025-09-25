import { ObjectId } from "mongodb";

export class Id {
  #value: ObjectId;
  private constructor(value: ObjectId) {
    this.#value = value;
  }
  public static create(value?: string): Id {
    if (value === "") return new Id(new ObjectId());
    return new Id(new ObjectId(value));
  }
  get value() {
    return this.#value;
  }
  toString() {
    return this.#value.toString();
  }
}
