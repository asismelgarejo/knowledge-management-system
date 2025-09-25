import {
  Book,
  BookContentTypes,
  CourseContentTypes,
  Documentation,
  DocumentationContentTypes,
  LearningPath,
  OnlineCourse,
} from "@/resources/domain/entities";
import { isLeft } from "fp-ts/Either";
import { GraphQLError, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { AppContext } from "../interfaces";
import { BookType } from "./book";
import { DocumentationType } from "./documentation";
import { LearningPathType } from "./learning-path";
import { OnlineCourseType } from "./online-course";

type Chapter = {
  id: string;
  name: string;
  type: BookContentTypes.CHAPTER;
  duration: number;
  goals: string[];
  notes: string[];
};

type Content =
  | {
      id: string;
      name: string;
      type: BookContentTypes.SECTION;
      chapters?: Chapter[];
    }
  | Chapter;
type ResponseDTO = {
  id: string;
  isbn: string;
  title: string;
  edition: number;
  cover: string;
  year: number;
  authors: { id: string; names: string }[];
  description?: string;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  contents: Content[];
  sources: { url: string; extension: "pdf" | "epub" }[];
};

export const QueryType = new GraphQLObjectType<any, AppContext>({
  name: "Query",
  fields: {
    book: {
      type: new GraphQLNonNull(BookType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(_, { id }, { application }) {
        const response = await application.getBook({ id });
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        function mapResponse(book: Book): ResponseDTO {
          const response: ResponseDTO = {
            id: book.id.toString(),
            isbn: book.isbn,
            title: book.title,
            edition: book.edition,
            cover: book.cover,
            year: book.year,
            authors: book.authors.map((author) => ({
              id: author.id.toString(),
              names: author.names,
            })),
            description: book.description || undefined,
            categories: book.categories.map((category) => ({
              id: category.id.toString(),
              name: category.name,
            })),
            tags: book.tags.map((tag) => ({
              id: tag.id.toString(),
              name: tag.name,
            })),
            contents: book.contents.map((content) => {
              switch (content.type) {
                case BookContentTypes.CHAPTER:
                  return {
                    id: content.id.toString(),
                    name: content.name,
                    type: BookContentTypes.CHAPTER,
                    duration: content.duration,
                    goals: [],
                    notes: content.notes,
                  };
                case BookContentTypes.SECTION:
                  return {
                    id: content.id.toString(),
                    name: content.name,
                    type: BookContentTypes.SECTION,
                    chapters: content.chapters.map((chapter) => ({
                      id: chapter.id.toString(),
                      name: chapter.name,
                      type: BookContentTypes.CHAPTER,
                      duration: chapter.duration,
                      goals: [],
                      notes: chapter.notes,
                    })),
                  };
              }
            }),
            sources: book.sources.map((source) => ({
              url: source.url,
              extension: source.extension,
            })),
          };

          return response;
        }

        return mapResponse(data);
      },
    },
    books: {
      type: new GraphQLNonNull(new GraphQLList(BookType)),
      args: {},
      async resolve(_, { id }, { application }) {
        const response = await application.getBooks(undefined);
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        function mapResponse(book: Book): ResponseDTO {
          const response: ResponseDTO = {
            id: book.id.toString(),
            isbn: book.isbn,
            title: book.title,
            edition: book.edition,
            cover: book.cover,
            year: book.year,
            authors: book.authors.map((author) => ({
              id: author.id.toString(),
              names: author.names,
            })),
            description: book.description || undefined,
            categories: book.categories.map((category) => ({
              id: category.id.toString(),
              name: category.name,
            })),
            tags: book.tags.map((tag) => ({
              id: tag.id.toString(),
              name: tag.name,
            })),
            contents: book.contents.map((content) => {
              switch (content.type) {
                case BookContentTypes.CHAPTER:
                  return {
                    id: content.id.toString(),
                    name: content.name,
                    type: BookContentTypes.CHAPTER,
                    duration: content.duration,
                    goals: [],
                    notes: content.notes,
                  };
                case BookContentTypes.SECTION:
                  return {
                    id: content.id.toString(),
                    name: content.name,
                    type: BookContentTypes.SECTION,
                    chapters: content.chapters.map((chapter) => ({
                      id: chapter.id.toString(),
                      name: chapter.name,
                      type: BookContentTypes.CHAPTER,
                      duration: chapter.duration,
                      goals: [],
                      notes: chapter.notes,
                    })),
                  };
              }
            }),
            sources: book.sources.map((source) => ({
              url: source.url,
              extension: source.extension,
            })),
          };

          return response;
        }

        return data.map((b) => mapResponse(b));
      },
    },
    online_courses: {
      type: new GraphQLNonNull(new GraphQLList(OnlineCourseType)),
      args: {},
      async resolve(_, __, { application }) {
        const response = await application.getOnlineCourses(undefined);
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        type ResponseDTO = {
          id: string;
          name: string;
        };
        const mapResponse = (oc: OnlineCourse): ResponseDTO => {
          const response: ResponseDTO = {
            id: oc.id.toString(),
            name: oc.name,
          };
          return response;
        };

        return data.map((b) => mapResponse(b));
      },
    },
    documentations: {
      type: new GraphQLNonNull(new GraphQLList(DocumentationType)),
      args: {},
      async resolve(_, __, { application }) {
        const response = await application.getDocumentations(undefined);
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        type ResponseDTO = {
          id: string;
          name: string;
        };
        const mapResponse = (oc: Documentation): ResponseDTO => {
          const response: ResponseDTO = {
            id: oc.id.toString(),
            name: oc.name,
          };
          return response;
        };

        return data.map((b) => mapResponse(b));
      },
    },
    search_books: {
      type: new GraphQLNonNull(new GraphQLList(BookType)),
      args: {
        search_term: {
          type: GraphQLString,
        },
      },
      async resolve(_, { search_term }, { application }) {
        const response = await application.searchBooks({ search_term });
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        function mapResponse(book: Book): ResponseDTO {
          const response: ResponseDTO = {
            id: book.id.toString(),
            isbn: book.isbn,
            title: book.title,
            edition: book.edition,
            cover: book.cover,
            year: book.year,
            authors: book.authors.map((author) => ({
              id: author.id.toString(),
              names: author.names,
            })),
            description: book.description || undefined,
            categories: book.categories.map((category) => ({
              id: category.id.toString(),
              name: category.name,
            })),
            tags: book.tags.map((tag) => ({
              id: tag.id.toString(),
              name: tag.name,
            })),
            contents: book.contents.map((content) => {
              switch (content.type) {
                case BookContentTypes.CHAPTER:
                  return {
                    id: content.id.toString(),
                    name: content.name,
                    type: BookContentTypes.CHAPTER,
                    duration: content.duration,
                    goals: [],
                    notes: content.notes,
                  };
                case BookContentTypes.SECTION:
                  return {
                    id: content.id.toString(),
                    name: content.name,
                    type: BookContentTypes.SECTION,
                    chapters: content.chapters.map((chapter) => ({
                      id: chapter.id.toString(),
                      name: chapter.name,
                      type: BookContentTypes.CHAPTER,
                      duration: chapter.duration,
                      goals: [],
                      notes: chapter.notes,
                    })),
                  };
              }
            }),
            sources: book.sources.map((source) => ({
              url: source.url,
              extension: source.extension,
            })),
          };

          return response;
        }

        return data.map((b) => mapResponse(b));
      },
    },
    learning_path: {
      type: new GraphQLNonNull(LearningPathType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(_, { id }, { application }) {
        const response = await application.getLearningPath({ id });
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        return null;
      },
    },
    learning_paths: {
      type: new GraphQLNonNull(new GraphQLList(LearningPathType)),
      args: {},
      async resolve(_, {}, { application }) {
        const response = await application.getLearningPaths(undefined);
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        type LearningResourceBase = {
          id: string;
          name: string;
          duration: number; // In seconds
        };
        type LearningResourceBook = LearningResourceBase & {
          readonly type: BookContentTypes.CHAPTER;
          section?: string;
          book: string;
        };
        type LearningResourceOnlineCourse = LearningResourceBase & {
          readonly type: CourseContentTypes.COURSE_CLASS;
          section?: string;
          online_course: string;
        };
        type LearningResourceDocumentation = LearningResourceBase & {
          readonly type: DocumentationContentTypes.DOCUMENTATION_SUBTOPIC;
          topic?: string;
          documentation: string;
        };
        type LearningResource = LearningResourceBook | LearningResourceOnlineCourse | LearningResourceDocumentation;

        type ResponseDTO = {
          id: string;
          title: string;
          initial_date: string;
          resources: LearningResource[];
        };

        function mapResponse(entity: LearningPath): ResponseDTO {
          const response: ResponseDTO = {
            id: entity.id.toString(),
            initial_date: entity.initialDate.toUTCString(),
            title: entity.title,
            resources: entity.resources.map((r) => ({
              ...r,
              id: r.id.toString(),
            })),
          };

          return response;
        }

        return data.map((d) => mapResponse(d));
      },
    },
  },
});
