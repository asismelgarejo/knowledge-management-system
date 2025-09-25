// value-objects/book-authors.vo.ts
import { Brand, Id } from "@/shared/value-objects";
import { BookAuthorsLimitExceededError, DuplicateBookAuthorError, EmptyBookAuthorsError } from "../errors";
import { AuthorFullName } from "./author-fullname.vo";

export const MAX_AUTHORS = 5;

export type AuthorRef = Readonly<{
  id: Id;
  fullName: AuthorFullName;
}>;

export type BookAuthors = Brand<ReadonlyArray<AuthorRef>, "BookAuthors">;

export const BookAuthors = {
  make: (items: ReadonlyArray<AuthorRef>): BookAuthors => {
    if (items.length === 0) {
      throw new EmptyBookAuthorsError();
    }
    if (items.length > MAX_AUTHORS) {
      throw new BookAuthorsLimitExceededError(MAX_AUTHORS);
    }

    const seen = new Set<string>();
    for (const a of items) {
      const idStr = a.id.toString();
      if (seen.has(idStr)) {
        throw new DuplicateBookAuthorError(idStr);
      }
      seen.add(idStr);
    }

    const normalized = [...items].sort((a, b) => a.id.toString().localeCompare(b.id.toString()));

    return Object.freeze(normalized) as BookAuthors;
  },

  add: (authors: BookAuthors, author: AuthorRef): BookAuthors => {
    const idStr = author.id.toString();

    if (authors.find((a) => a.id.toString() === idStr)) {
      throw new DuplicateBookAuthorError(idStr);
    }
    if (authors.length + 1 > MAX_AUTHORS) {
      throw new BookAuthorsLimitExceededError(MAX_AUTHORS);
    }

    return BookAuthors.make([...authors, author]);
  },

  remove: (authors: BookAuthors, id: Id): BookAuthors => {
    const target = id.toString();
    const next = authors.filter((a) => a.id.toString() !== target);

    // business choice: allow empty or enforce non-empty
    if (next.length === 0) {
      throw new EmptyBookAuthorsError();
    }

    return BookAuthors.make(next);
  },

  size: (authors: BookAuthors): number => authors.length,

  values: (authors: BookAuthors): ReadonlyArray<AuthorRef> => [...authors],

  toPrimitives: (authors: BookAuthors): ReadonlyArray<{ id: string; fullName: string }> =>
    authors.map((a) => ({ id: a.id.toString(), fullName: a.fullName })),
};
