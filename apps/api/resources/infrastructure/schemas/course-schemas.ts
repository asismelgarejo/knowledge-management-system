import { CourseContentTypes, CourseTypes } from "@/resources/domain/entities";
import { Schema } from "mongoose";
import { DbCourse, DbCourseClass, DbCourseSection } from "./course";

// Define el esquema para los capítulos
const ClassSchema = new Schema<DbCourseClass>(
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

const SectionSchema = new Schema<DbCourseSection>(
  {
    name: { type: String, required: true },
    classes: [ClassSchema],
  },
  { _id: true },
);
const ContentSchema = new Schema({}, { discriminatorKey: "type" });

// Define el esquema para el contenido del libro

const OnlineCourseSchema = new Schema<DbCourse>({
  contents: {
    type: [ContentSchema],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const contents = OnlineCourseSchema.path<Schema.Types.DocumentArray>("contents");
contents.discriminator(CourseContentTypes.COURSE_CLASS, ClassSchema);
contents.discriminator(CourseContentTypes.COURSE_SECTION, SectionSchema);

const CourseSchema = new Schema({}, { discriminatorKey: "type" });
CourseSchema.discriminator(CourseTypes.ONLINE_COURSE, OnlineCourseSchema);

export { CourseSchema };
