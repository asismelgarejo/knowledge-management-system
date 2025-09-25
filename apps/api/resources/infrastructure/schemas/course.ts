import { CourseContentTypes, CourseTypes } from "@/resources/domain/entities";
import { ObjectId } from "mongodb";

export type DbCourseClass = {
  id: ObjectId;
  name: string;
  readonly type: CourseContentTypes.COURSE_CLASS;
  duration: number;
  notes: string[];
};

export type DbCourseSection = {
  id: ObjectId;
  name: string;
  readonly type: CourseContentTypes.COURSE_SECTION;
  classes: DbCourseClass[];
};

export type DbCourseContent = DbCourseClass | DbCourseSection;

type DbCourseBase = {
  _id: ObjectId;
  name: string;
  contents: DbCourseContent[];
};
export type DbOnlineCourse = DbCourseBase & {
  readonly type: CourseTypes.ONLINE_COURSE;
};
export type DbCourse = {} & DbOnlineCourse;
