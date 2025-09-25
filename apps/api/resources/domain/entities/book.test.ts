import {
  InvalidBookAuthorNameError,
  InvalidBookCategoryNameError,
  InvalidBookContentChapterNameError,
  InvalidBookContentSectionNameError,
  InvalidBookCoverError,
  InvalidBookDescriptionError,
  InvalidBookEditionError,
  InvalidBookSourceExtensionError,
  InvalidBookSourceUrlError,
  InvalidBookTagNameError,
  InvalidBookTitleError,
  InvalidBookYearError,
  InvalidISBNError,
} from "@/resources/domain/errors";
import { Id } from "@/resources/shared/common-values";
import { isLeft, isRight } from "fp-ts/Either";
import {
  Book,
  BookContentTypes,
  BookExtensionsTypes,
  type BookAuthor,
  type BookCategory,
  type BookContent,
  type BookProps,
  type BookSource,
  type BookTag,
} from "./book";

describe("Book", () => {
  const validId = Id.create("507f1f77bcf86cd799439011");
  const validBookProps: BookProps = {
    id: Id.create("507f1f77bcf86cd799439011"),
    isbn: "978-0-123-45678-9",
    title: "Test Book",
    edition: 1,
    sources: [
      {
        url: "https://example.com/book.pdf",
        extension: BookExtensionsTypes.pdf,
      },
    ],
    cover: "https://example.com/cover.jpg",
    year: 2023,
    authors: [
      {
        id: validId!,
        names: "John Doe",
      },
    ],
    categories: [
      {
        id: validId!,
        name: "Fiction",
      },
    ],
    tags: [
      {
        id: validId!,
        name: "Adventure",
      },
    ],
    contents: [
      {
        id: validId!,
        name: "Chapter 1",
        type: BookContentTypes.CHAPTER,
      },
    ],
    description: "A test book description",
  };

  describe("Book.create", () => {
    test("should create a valid book with all required fields", () => {
      const result = Book.create(validBookProps);

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        const book = result.right;
        expect(book.title).toBe("Test Book");
        expect(book.isbn).toBe("978-0-123-45678-9");
        expect(book.edition).toBe(1);
        expect(book.year).toBe(2023);
        expect(book.authors).toEqual(validBookProps.authors);
        expect(book.categories).toEqual(validBookProps.categories);
        expect(book.tags).toEqual(validBookProps.tags);
        expect(book.contents).toEqual(validBookProps.contents);
        expect(book.sources).toEqual(validBookProps.sources);
        expect(book.cover).toBe("https://example.com/cover.jpg");
        expect(book.description).toBe("A test book description");
      }
    });

    test("should create a valid book without optional description", () => {
      const propsWithoutDescription = { ...validBookProps };
      delete propsWithoutDescription.description;

      const result = Book.create(propsWithoutDescription);

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.right.description).toBeUndefined();
      }
    });

    describe("ISBN validation", () => {
      test("should reject invalid ISBN format", () => {
        const invalidProps = { ...validBookProps, isbn: "invalid-isbn" };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidISBNError);
        }
      });

      test("should accept valid ISBN-13 starting with 978", () => {
        const validProps = { ...validBookProps, isbn: "978-1-234-56789-0" };
        const result = Book.create(validProps);

        expect(isRight(result)).toBe(true);
      });

      test("should accept valid ISBN-13 starting with 979", () => {
        const validProps = { ...validBookProps, isbn: "979-1-234-56789-7" };
        const result = Book.create(validProps);

        expect(isRight(result)).toBe(true);
      });
    });

    describe("Edition validation", () => {
      test("should reject negative edition", () => {
        const invalidProps = { ...validBookProps, edition: -1 };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookEditionError);
        }
      });

      test("should reject zero edition", () => {
        const invalidProps = { ...validBookProps, edition: 0 };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookEditionError);
        }
      });

      test("should reject non-integer edition", () => {
        const invalidProps = { ...validBookProps, edition: 1.5 };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookEditionError);
        }
      });
    });

    describe("Title validation", () => {
      test("should reject empty title", () => {
        const invalidProps = { ...validBookProps, title: "" };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookTitleError);
        }
      });
    });

    describe("Cover validation", () => {
      test("should reject invalid cover URL", () => {
        const invalidProps = { ...validBookProps, cover: "not-a-url" };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookCoverError);
        }
      });
    });

    describe("Year validation", () => {
      test("should reject negative year", () => {
        const invalidProps = { ...validBookProps, year: -1 };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookYearError);
        }
      });

      test("should reject non-integer year", () => {
        const invalidProps = { ...validBookProps, year: 2023.5 };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookYearError);
        }
      });
    });

    describe("Authors validation", () => {
      test("should reject authors with empty names", () => {
        const invalidProps = {
          ...validBookProps,
          authors: [{ id: validId!, names: "" }],
        };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookAuthorNameError);
        }
      });
    });

    describe("Categories validation", () => {
      test("should reject categories with empty names", () => {
        const invalidProps = {
          ...validBookProps,
          categories: [{ id: validId!, name: "" }],
        };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookCategoryNameError);
        }
      });
    });

    describe("Tags validation", () => {
      test("should reject tags with empty names", () => {
        const invalidProps = {
          ...validBookProps,
          tags: [{ id: validId!, name: "" }],
        };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookTagNameError);
        }
      });
    });

    describe("Sources validation", () => {
      test("should reject sources with invalid URLs", () => {
        const invalidProps = {
          ...validBookProps,
          sources: [{ url: "not-a-url", extension: BookExtensionsTypes.pdf }],
        };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookSourceUrlError);
        }
      });

      test("should reject sources with invalid extensions", () => {
        const invalidProps = {
          ...validBookProps,
          sources: [{ url: "https://example.com/book.pdf", extension: "invalid" as BookExtensionsTypes }],
        };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookSourceExtensionError);
        }
      });

      test("should accept epub extension", () => {
        const validProps = {
          ...validBookProps,
          sources: [{ url: "https://example.com/book.epub", extension: BookExtensionsTypes.epub }],
        };
        const result = Book.create(validProps);

        expect(isRight(result)).toBe(true);
      });
    });

    describe("Contents validation", () => {
      test("should reject chapters with empty names", () => {
        const invalidProps = {
          ...validBookProps,
          contents: [
            {
              id: validId!,
              name: "",
              type: BookContentTypes.CHAPTER as const,
            },
          ],
        };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookContentChapterNameError);
        }
      });

      test("should reject sections with empty names", () => {
        const invalidProps = {
          ...validBookProps,
          contents: [
            {
              id: validId!,
              name: "",
              type: BookContentTypes.SECTION,
              chapters: [],
            },
          ],
        };
        const result = Book.create(invalidProps);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookContentSectionNameError);
        }
      });

      test("should accept valid sections with chapters", () => {
        const validProps = {
          ...validBookProps,
          contents: [
            {
              id: validId!,
              name: "Section 1",
              type: BookContentTypes.SECTION as const,
              chapters: [
                {
                  id: validId!,
                  name: "Chapter 1.1",
                  type: BookContentTypes.CHAPTER as const,
                },
              ],
            },
          ],
        };
        const result = Book.create(validProps);

        expect(isRight(result)).toBe(true);
      });
    });

    describe("Description validation", () => {
      test("should reject empty description when provided", () => {
        const invalidProps = { ...validBookProps, description: "" };
        const result = Book.create(invalidProps);
        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookDescriptionError);
        }
      });
    });
  });

  describe("Book update methods", () => {
    let book: Book;

    beforeEach(() => {
      const result = Book.create(validBookProps);
      if (isRight(result)) {
        book = result.right;
      }
    });

    describe("updateTitle", () => {
      test("should update title with valid value", () => {
        const result = book.updateTitle("New Title");

        expect(isRight(result)).toBe(true);
        expect(book.title).toBe("New Title");
      });

      test("should reject empty title", () => {
        const result = book.updateTitle("");

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookTitleError);
        }
        expect(book.title).toBe("Test Book"); // Should not change
      });
    });

    describe("updateISBN", () => {
      test("should update ISBN with valid value", () => {
        const newISBN = "979-1-234-56789-7";
        const result = book.updateISBN(newISBN);

        expect(isRight(result)).toBe(true);
        expect(book.isbn).toBe(newISBN);
      });

      test("should reject invalid ISBN", () => {
        const result = book.updateISBN("invalid-isbn");

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidISBNError);
        }
        expect(book.isbn).toBe("978-0-123-45678-9"); // Should not change
      });
    });

    describe("updateEdition", () => {
      test("should update edition with valid value", () => {
        const result = book.updateEdition(2);

        expect(isRight(result)).toBe(true);
        expect(book.edition).toBe(2);
      });

      test("should reject invalid edition", () => {
        const result = book.updateEdition(0);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookEditionError);
        }
        expect(book.edition).toBe(1); // Should not change
      });
    });

    describe("updateCover", () => {
      test("should update cover with valid URL", () => {
        const newCover = "https://example.com/new-cover.jpg";
        const result = book.updateCover(newCover);

        expect(isRight(result)).toBe(true);
        expect(book.cover).toBe(newCover);
      });

      test("should reject invalid URL", () => {
        const result = book.updateCover("not-a-url");

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookCoverError);
        }
        expect(book.cover).toBe("https://example.com/cover.jpg"); // Should not change
      });
    });

    describe("updateYear", () => {
      test("should update year with valid value", () => {
        const result = book.updateYear(2024);

        expect(isRight(result)).toBe(true);
        expect(book.year).toBe(2024);
      });

      test("should reject negative year", () => {
        const result = book.updateYear(-1);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookYearError);
        }
        expect(book.year).toBe(2023); // Should not change
      });
    });

    describe("updateAuthors", () => {
      test("should update authors with valid values", () => {
        const newAuthors: BookAuthor[] = [
          { id: validId!, names: "Jane Smith" },
          { id: validId!, names: "Bob Johnson" },
        ];
        const result = book.updateAuthors(newAuthors);

        expect(isRight(result)).toBe(true);
        expect(book.authors).toEqual(newAuthors);
      });

      test("should reject authors with empty names", () => {
        const invalidAuthors: BookAuthor[] = [{ id: validId!, names: "" }];
        const result = book.updateAuthors(invalidAuthors);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookAuthorNameError);
        }
      });
    });

    describe("updateDescription", () => {
      test("should update description with valid value", () => {
        const newDescription = "Updated description";
        const result = book.updateDescription(newDescription);

        expect(isRight(result)).toBe(true);
        expect(book.description).toBe(newDescription);
      });

      test("should reject empty description", () => {
        const result = book.updateDescription("");

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookDescriptionError);
        }
      });
    });

    describe("updateCategories", () => {
      test("should update categories with valid values", () => {
        const newCategories: BookCategory[] = [
          { id: validId!, name: "Science Fiction" },
          { id: validId!, name: "Adventure" },
        ];
        const result = book.updateCategories(newCategories);

        expect(isRight(result)).toBe(true);
        expect(book.categories).toEqual(newCategories);
      });

      test("should reject categories with empty names", () => {
        const invalidCategories: BookCategory[] = [{ id: validId!, name: "" }];
        const result = book.updateCategories(invalidCategories);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookCategoryNameError);
        }
      });
    });

    describe("updateTags", () => {
      test("should update tags with valid values", () => {
        const newTags: BookTag[] = [
          { id: validId!, name: "Thriller" },
          { id: validId!, name: "Mystery" },
        ];
        const result = book.updateTags(newTags);

        expect(isRight(result)).toBe(true);
        expect(book.tags).toEqual(newTags);
      });

      test("should reject tags with empty names", () => {
        const invalidTags: BookTag[] = [{ id: validId!, name: "" }];
        const result = book.updateTags(invalidTags);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookTagNameError);
        }
      });
    });

    describe("updateSources", () => {
      test("should update sources with valid values", () => {
        const newSources: BookSource[] = [
          { url: "https://example.com/book1.pdf", extension: BookExtensionsTypes.pdf },
          { url: "https://example.com/book2.epub", extension: BookExtensionsTypes.epub },
        ];
        const result = book.updateSources(newSources);

        expect(isRight(result)).toBe(true);
        expect(book.sources).toEqual(newSources);
      });

      test("should reject sources with invalid URLs", () => {
        const invalidSources: BookSource[] = [{ url: "not-a-url", extension: BookExtensionsTypes.pdf }];
        const result = book.updateSources(invalidSources);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookSourceUrlError);
        }
      });
    });

    describe("updateContent", () => {
      test("should update content with valid values", () => {
        const newContent: BookContent[] = [
          { id: validId!, name: "Introduction", type: BookContentTypes.CHAPTER },
          {
            id: validId!,
            name: "Part I",
            type: BookContentTypes.SECTION,
            chapters: [{ id: validId!, name: "Chapter 1", type: BookContentTypes.CHAPTER }],
          },
        ];
        const result = book.updateContent(newContent);

        expect(isRight(result)).toBe(true);
        expect(book.contents).toEqual(newContent);
      });

      test("should reject content with empty chapter names", () => {
        const invalidContent: BookContent[] = [{ id: validId!, name: "", type: BookContentTypes.CHAPTER }];
        const result = book.updateContent(invalidContent);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookContentChapterNameError);
        }
      });

      test("should reject content with empty section names", () => {
        const invalidContent: BookContent[] = [
          {
            id: validId!,
            name: "",
            type: BookContentTypes.SECTION,
            chapters: [],
          },
        ];
        const result = book.updateContent(invalidContent);

        expect(isLeft(result)).toBe(true);
        if (isLeft(result)) {
          expect(result.left).toBeInstanceOf(InvalidBookContentSectionNameError);
        }
      });
    });
  });

  describe("Book getters", () => {
    let book: Book;

    beforeEach(() => {
      const result = Book.create(validBookProps);
      if (isRight(result)) {
        book = result.right;
      }
    });

    test("should have correct getter values", () => {
      expect(book.id).toBeInstanceOf(Id);
      expect(book.isbn).toBe("978-0-123-45678-9");
      expect(book.title).toBe("Test Book");
      expect(book.edition).toBe(1);
      expect(book.cover).toBe("https://example.com/cover.jpg");
      expect(book.year).toBe(2023);
      expect(book.authors).toEqual(validBookProps.authors);
      expect(book.categories).toEqual(validBookProps.categories);
      expect(book.tags).toEqual(validBookProps.tags);
      expect(book.contents).toEqual(validBookProps.contents);
      expect(book.sources).toEqual(validBookProps.sources);
      expect(book.description).toBe("A test book description");
    });
  });
});
