import { BookContentTypes, CourseContentTypes, DocumentationContentTypes } from "@/resources/domain/entities";
import { Schema } from "mongoose";
import {
  DbLearningPath,
  DbLearningResourceBase,
  DbLearningResourceBook,
  DbLearningResourceOnlineCourse,
  LearningResourceDocumentation,
} from "./learning-path";

// Definir el esquema base para recursos de aprendizaje
const LearningResourceSchema = new Schema<DbLearningResourceBase>(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // En segundos
  },
  { discriminatorKey: "type", timestamps: true },
);

// Definir el modelo base

// Definir el esquema para libros
const LearningResourceBookSchema = new Schema<DbLearningResourceBook>({
  section: { type: String },
  book: { type: String, required: true },
});
LearningResourceSchema.discriminator(BookContentTypes.CHAPTER, LearningResourceBookSchema);

// Definir el esquema para cursos en línea
const LearningResourceOnlineCourseSchema = new Schema<DbLearningResourceOnlineCourse>({
  section: { type: String },
  online_course: { type: String, required: true },
});
LearningResourceSchema.discriminator(CourseContentTypes.COURSE_CLASS, LearningResourceOnlineCourseSchema);

// Definir el esquema para documentación
const LearningResourceDocumentationSchema = new Schema<LearningResourceDocumentation>({
  topic: { type: String },
  documentation: { type: String, required: true },
});
LearningResourceSchema.discriminator(
  DocumentationContentTypes.DOCUMENTATION_SUBTOPIC,
  LearningResourceDocumentationSchema,
);

export const LearningPathSchema = new Schema<DbLearningPath>({
  title: { type: String, required: true },
  initial_date: { type: Date },
  resources: [{ type: LearningResourceSchema, required: true }],
});
