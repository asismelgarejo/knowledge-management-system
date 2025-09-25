// infra/schemas/books.ts
import { BookTypes } from "@/books/domain/constants";
import { Infer, Schematizer as S } from "mongo-schema-reporter";

// ---- Base (ya lo tenías) ----
export const SchemaBook = S.object({
  _id: S.objectId(),
  title: S.string(),
  authors: S.array(
    S.object({
      id: S.objectId(),
      full_name: S.string(),
    }),
  ),
});
export type DbBookBase = Infer<typeof SchemaBook>;

// ---- Helpers reutilizables ----
const SchemaAuthor = S.object({
  id: S.objectId(),
  full_name: S.string(),
});
const SchemaAuthors = S.array(SchemaAuthor);

const schemaFor = <T extends `${BookTypes}`>(type: T) =>
  S.object({
    _id: S.objectId(),
    type: S.literal(type),
    title: S.string(),
    authors: SchemaAuthors,
  });

// ---- Schemas específicos por tipo (discriminados por `type`) ----
export const SchemaBookSectionChapter = schemaFor(BookTypes.SECTION_CHAPTER);
export const SchemaBookChapterOnly = schemaFor(BookTypes.CHAPTER_ONLY);
export const SchemaBookUnitLesson = schemaFor(BookTypes.UNIT_LESSON);
export const SchemaBookModule = schemaFor(BookTypes.MODULE);
export const SchemaBookTopic = schemaFor(BookTypes.TOPIC);
export const SchemaBookEntryArticle = schemaFor(BookTypes.ENTRY_ARTICLE);
export const SchemaBookActArc = schemaFor(BookTypes.ACT_ARC);
export const SchemaBookCaseStudy = schemaFor(BookTypes.CASE_STUDY);
export const SchemaBookPracticeExercise = schemaFor(BookTypes.PRACTICE_EXERCISE);
export const SchemaBookVolume = schemaFor(BookTypes.VOLUME);
export const SchemaBookIndependentStory = schemaFor(BookTypes.INDEPENDENT_STORY);
export const SchemaBookTimeline = schemaFor(BookTypes.TIMELINE);
export const SchemaBookAlphabetical = schemaFor(BookTypes.ALPHABETICAL);
export const SchemaBookManualReference = schemaFor(BookTypes.MANUAL_REFERENCE);
export const SchemaBookMapDiagram = schemaFor(BookTypes.MAP_DIAGRAM);

// ---- Tipos inferidos por cada clase de dominio ----
export type DbBookSectionChapter = Infer<typeof SchemaBookSectionChapter>;
export type DbBookChapterOnly = Infer<typeof SchemaBookChapterOnly>;
export type DbBookUnitLesson = Infer<typeof SchemaBookUnitLesson>;
export type DbBookModule = Infer<typeof SchemaBookModule>;
export type DbBookTopic = Infer<typeof SchemaBookTopic>;
export type DbBookEntryArticle = Infer<typeof SchemaBookEntryArticle>;
export type DbBookActArc = Infer<typeof SchemaBookActArc>;
export type DbBookCaseStudy = Infer<typeof SchemaBookCaseStudy>;
export type DbBookPracticeExercise = Infer<typeof SchemaBookPracticeExercise>;
export type DbBookVolume = Infer<typeof SchemaBookVolume>;
export type DbBookIndependentStory = Infer<typeof SchemaBookIndependentStory>;
export type DbBookTimeline = Infer<typeof SchemaBookTimeline>;
export type DbBookAlphabetical = Infer<typeof SchemaBookAlphabetical>;
export type DbBookManualReference = Infer<typeof SchemaBookManualReference>;
export type DbBookMapDiagram = Infer<typeof SchemaBookMapDiagram>;

// ---- Unión total (persistencia) + schema unión (opcional) ----
export type DbBook =
  | DbBookSectionChapter
  | DbBookChapterOnly
  | DbBookUnitLesson
  | DbBookModule
  | DbBookTopic
  | DbBookEntryArticle
  | DbBookActArc
  | DbBookCaseStudy
  | DbBookPracticeExercise
  | DbBookVolume
  | DbBookIndependentStory
  | DbBookTimeline
  | DbBookAlphabetical
  | DbBookManualReference
  | DbBookMapDiagram;

// Útil para validaciones de lectura/escritura cuando no conoces el tipo
export const SchemaBookAny = S.discriminatedUnion("Book", [
  SchemaBookSectionChapter,
  SchemaBookChapterOnly,
  SchemaBookUnitLesson,
  SchemaBookModule,
  SchemaBookTopic,
  SchemaBookEntryArticle,
  SchemaBookActArc,
  SchemaBookCaseStudy,
  SchemaBookPracticeExercise,
  SchemaBookVolume,
  SchemaBookIndependentStory,
  SchemaBookTimeline,
  SchemaBookAlphabetical,
  SchemaBookManualReference,
  SchemaBookMapDiagram,
]);
