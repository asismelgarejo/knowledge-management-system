import { BookContentTypes, CourseContentTypes, DocumentationContentTypes } from "@/resources/domain/entities";
import { ObjectId } from "mongodb";

export type DbLearningResourceBase = {
  _id: ObjectId;
  name: string;
  duration: number; // In seconds
  order: number; // In seconds
};
export type DbLearningResourceBook = DbLearningResourceBase & {
  readonly type: BookContentTypes.CHAPTER;
  section?: string;
  book: string;
};
export type DbLearningResourceOnlineCourse = DbLearningResourceBase & {
  readonly type: CourseContentTypes.COURSE_CLASS;
  section?: string;
  online_course: string;
};
export type LearningResourceDocumentation = DbLearningResourceBase & {
  readonly type: DocumentationContentTypes.DOCUMENTATION_SUBTOPIC;
  topic?: string;
  documentation: string;
};
export type DbLearningResource =
  | DbLearningResourceBook
  | DbLearningResourceOnlineCourse
  | LearningResourceDocumentation;

export type DbLearningPath = {
  _id: ObjectId;
  title: string;
  initial_date: Date;
  resources: DbLearningResource[];
};
