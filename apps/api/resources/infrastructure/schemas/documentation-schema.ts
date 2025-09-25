import { CourseContentTypes } from "@/resources/domain/entities";
import { Schema } from "mongoose";
import { DbCourseClass, DbCourseSection } from "./course";
import { DbDocumentation } from "./documentation";

// Define el esquema para los capítulos
const SubtopicSchema = new Schema<DbCourseClass>(
  {
    duration: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    notes: {
      type: [String],
      required: true,
    },
  },
  { _id: true },
);

const TopicSchema = new Schema<DbCourseSection>(
  {
    name: { type: String, required: true },
    classes: [SubtopicSchema],
  },
  { _id: true },
);
const ContentSchema = new Schema({}, { discriminatorKey: "type" });

// Define el esquema para el contenido del libro

const DocumentationSchema = new Schema<DbDocumentation>({
  contents: {
    type: [ContentSchema],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const contents = DocumentationSchema.path<Schema.Types.DocumentArray>("contents");
contents.discriminator(CourseContentTypes.COURSE_CLASS, SubtopicSchema);
contents.discriminator(CourseContentTypes.COURSE_SECTION, TopicSchema);

export { DocumentationSchema };
