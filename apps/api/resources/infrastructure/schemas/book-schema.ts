import { BookContentTypes, BookExtensionsTypes } from "@/resources/domain/entities";
import { ResourceTypes } from "@/resources/domain/entities/interfaces";
import { Schema } from "mongoose";
import { COLLECTION_NAMES } from "../repositories";
import { DbBook, DbBookChapter, DbBookSection } from "./book";

// Define el esquema para los capítulos
const ChapterSchema = new Schema<DbBookChapter>(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    goals: { type: [String], required: true },
    notes: { type: [String], required: true },
  },
  { _id: true },
);

const SectionSchema = new Schema<DbBookSection>(
  {
    name: { type: String, required: true },
    chapters: [ChapterSchema],
  },
  { _id: true },
);

// Define el esquema para el contenido del libro
const ContentSchema = new Schema({}, { discriminatorKey: "type" });

// Define el esquema para las fuentes del libro
const SourceSchema = new Schema({
  url: { type: String, required: true },
  extension: { type: String, enum: Object.values(BookExtensionsTypes), required: true },
});

// Define el esquema para las etiquetas del libro
const TagSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
});

// Define el esquema principal para el libro
const BookSchema = new Schema<DbBook>(
  {
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    edition: { type: Number, required: true },
    cover: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String },
    authors: [{ type: Schema.Types.ObjectId, ref: COLLECTION_NAMES.AUTHORS }],
    categories: [{ type: Schema.Types.ObjectId, ref: COLLECTION_NAMES.CATEGORIES }],
    tags: [{ type: Schema.Types.ObjectId, ref: COLLECTION_NAMES.TAGS }],
    contents: [ContentSchema],
    sources: [SourceSchema],
  },
  { timestamps: true },
);

const contents = BookSchema.path<Schema.Types.DocumentArray>("contents");
contents.discriminator(BookContentTypes.CHAPTER, ChapterSchema);
contents.discriminator(BookContentTypes.SECTION, SectionSchema);

const Resourcechema = new Schema({}, { discriminatorKey: "type" });
Resourcechema.discriminator(ResourceTypes.BOOK, BookSchema);

export { BookSchema };
