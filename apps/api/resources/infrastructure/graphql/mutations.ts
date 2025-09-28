import { Book, BookContentTypes, Documentation, LearningPath, OnlineCourse } from "@/resources/domain/entities";
import { Id } from "@/resources/shared/common-values";
import { isLeft } from "fp-ts/lib/Either";
import { GraphQLError, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { AppContext } from "../interfaces";
import { BookType } from "./book";
import { CreateBookRequestPayload } from "./book-payloads";
import { DocumentationType } from "./documentation";
import { DocumentationRequestPayload } from "./documentation-payload";
import { LearningPathType } from "./learning-path";
import { CreateLearningPathPayload } from "./learning-path-payloads";
import { OnlineCourseType } from "./online-course";
import { OnlineCourseRequestPayload } from "./online-course-payloads";

export const MutationType = new GraphQLObjectType<any, AppContext>({
  name: "Mutation",
  fields: () => ({
    book: {
      type: new GraphQLNonNull(BookType),
      args: {
        input: { type: new GraphQLNonNull(CreateBookRequestPayload) },
      },
      async resolve(_, { input }, { application }) {
        type TContent = {
          section?: {
            name: string;
            chapters: string[];
          };
          chapter?: string;
        };
        const contents = input.contents.reduce((prev: any[], e: TContent) => {
          if (e.section) return [...prev, { name: e.section.name, chapters: e.section.chapters }];
          return [...prev, e.chapter];
        }, [] as any);
        const response = await application.createResource({ ...input, contents });
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        //#region types
        type BookChapter = {
          id: string;
          name: string;
          type: BookContentTypes.CHAPTER;
        };
        type BookSection = {
          id: string;
          name: string;
          type: BookContentTypes.SECTION;
          chapters: BookChapter[];
        };
        type BookContent = BookChapter | BookSection;

        type BookResponseDTO = {
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
          contents: BookContent[];
          sources: { url: string; extension: "pdf" | "epub" }[];
        };
        //#endregion types

        const idResp = Id.create(data.id.toString());
        if (isLeft(idResp)) throw new GraphQLError(idResp.left.code, { extensions: { code: idResp.left.code } });
        function mapResponse(book: Book): BookResponseDTO {
          const response: BookResponseDTO = {
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
              if (content.type === BookContentTypes.CHAPTER) {
                return {
                  id: content.id.toString(),
                  name: content.name,
                  type: BookContentTypes.CHAPTER,
                };
              }
              return {
                id: content.id.toString(),
                name: content.name,
                type: content.type,
                chapters: content.chapters.map((chapter) => ({
                  id: chapter.id.toString(),
                  name: chapter.name,
                  type: chapter.type,
                })),
              };
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
    learning_path: {
      type: new GraphQLNonNull(LearningPathType),
      args: {
        input: { type: new GraphQLNonNull(CreateLearningPathPayload) },
      },
      async resolve(_, { input }, { application }) {
        const response = await application.createLearningPath(input);
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        const idResp = Id.create(data.id.toString());
        if (isLeft(idResp)) throw new GraphQLError(idResp.left.code, { extensions: { code: idResp.left.code } });

        type ResponseDTO = {
          id: string;
          title: string;
          initial_date: Date;
          // resources: LearningResource[];
        };

        function mapResponse(lp: LearningPath): ResponseDTO {
          const response: ResponseDTO = {
            id: lp.id.toString(),
            initial_date: lp.initialDate,
            title: lp.title,
          };

          return response;
        }

        return mapResponse(data);
      },
    },

    online_course: {
      type: new GraphQLNonNull(OnlineCourseType),
      args: {
        input: { type: new GraphQLNonNull(OnlineCourseRequestPayload) },
      },
      async resolve(_, { input }, { application }) {
        const response = await application.createOnlineCourse(input);
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        const idResp = Id.create(data.id.toString());
        if (isLeft(idResp)) throw new GraphQLError(idResp.left.code, { extensions: { code: idResp.left.code } });

        type ResponseDTO = {
          id: string;
          name: string;
        };

        const mapResponse = (data: OnlineCourse): ResponseDTO => {
          const response: ResponseDTO = {
            id: data.id.toString(),
            name: data.name,
          };
          return response;
        };

        return mapResponse(data);
      },
    },
    documentation: {
      type: new GraphQLNonNull(DocumentationType),
      args: {
        input: { type: new GraphQLNonNull(DocumentationRequestPayload) },
      },
      async resolve(_, { input }, { application }) {
        const response = await application.createDocumentation(input);
        if (isLeft(response)) throw new GraphQLError(response.left.code, { extensions: { code: response.left.code } });
        const data = response.right;

        const idResp = Id.create(data.id.toString());
        if (isLeft(idResp)) throw new GraphQLError(idResp.left.code, { extensions: { code: idResp.left.code } });

        type ResponseDTO = {
          id: string;
          name: string;
        };

        const mapResponse = (data: Documentation): ResponseDTO => {
          const response: ResponseDTO = {
            id: data.id.toString(),
            name: data.name,
          };
          return response;
        };

        return mapResponse(data);
      },
    },
  }),
});
