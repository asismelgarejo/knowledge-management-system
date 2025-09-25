import { BookContentTypes } from "@/resources/domain/entities";
import { GraphQLUnionType } from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLEnumType,
  GraphQLNonNull,
} = require("graphql");

// Enum para el tipo de contenido del libro
const BookContentTypeEnum = new GraphQLEnumType({
  name: "BookContentTypeEnum",
  values: {
    CHAPTER: { value: "BOOK_CHAPTER" },
    SECTION: { value: "BOOK_SECTION" },
  },
});

// Enum para las extensiones de los libros
const BookExtensionsTypeEnum = new GraphQLEnumType({
  name: "BookExtensionsTypeEnum",
  values: {
    PDF: { value: "pdf" },
    EPUB: { value: "epub" },
  },
});

// Tipo de contenido del libro
const BookContentChapter = new GraphQLObjectType({
  name: "BookContentChapter",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(BookContentTypeEnum) },
    duration: { type: new GraphQLNonNull(GraphQLInt) },
    goals: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    notes: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
  },
});
const BookContentSection = new GraphQLObjectType({
  name: "BookContentSection",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(BookContentTypeEnum) },
    chapters: { type: new GraphQLList(new GraphQLNonNull(BookContentChapter)) },
  },
});
const BookContentUnion = new GraphQLUnionType({
  name: "BookContent",
  types: [BookContentSection, BookContentChapter],
  resolveType: async (value) => {
    if (value.type === BookContentTypes.CHAPTER) return "BookContentChapter";
    if (value.type === BookContentTypes.SECTION) return "BookContentSection";
    return undefined;
  },
});

// Tipo de fuente del libro
const BookSource = new GraphQLObjectType({
  name: "BookSource",
  fields: {
    url: { type: new GraphQLNonNull(GraphQLString) },
    extension: { type: new GraphQLNonNull(BookExtensionsTypeEnum) },
  },
});

// Tipo de autor del libro
const BookAuthor = new GraphQLObjectType({
  name: "BookAuthor",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    names: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Tipo de categoría del libro
const BookCategory = new GraphQLObjectType({
  name: "BookCategory",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Tipo de etiqueta del libro
const BookTag = new GraphQLObjectType({
  name: "BookTag",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
});

// Tipo de libro
export const BookType = new GraphQLObjectType({
  name: "BookType",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    isbn: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    edition: { type: new GraphQLNonNull(GraphQLInt) },
    cover: { type: new GraphQLNonNull(GraphQLString) },
    year: { type: new GraphQLNonNull(GraphQLInt) },
    authors: { type: new GraphQLList(new GraphQLNonNull(BookAuthor)) },
    description: { type: GraphQLString },
    categories: { type: new GraphQLList(new GraphQLNonNull(BookCategory)) },
    tags: { type: new GraphQLList(new GraphQLNonNull(BookTag)) },
    contents: { type: new GraphQLList(new GraphQLNonNull(BookContentUnion)) },
    sources: { type: new GraphQLList(new GraphQLNonNull(BookSource)) },
  },
});
