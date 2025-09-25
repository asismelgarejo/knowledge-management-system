import { BookContentTypes, BookExtensionsTypes } from "@/resources/domain/entities";
import { ResourceTypes } from "@/resources/domain/entities/interfaces";
import { ObjectId } from "mongodb";

export type DbChapterGoal = {
  title: string;
  prove: string;
};

export type DbBookChapter = {
  _id: ObjectId;
  name: string;
  duration: number; // In seconds
  goals: DbChapterGoal[];
  notes: string[];
  readonly type: BookContentTypes.CHAPTER;
};
export type DbBookSection = {
  _id: ObjectId;
  name: string;
  type: BookContentTypes.SECTION;
  chapters: DbBookChapter[];
};
export type DbBookContent = DbBookSection | DbBookChapter;

export type DbBookAuthor = {
  _id: ObjectId;
  names: string;
};
export type DbBookCategory = {
  _id: ObjectId;
  name: string;
};
export type DbBookTag = {
  _id: ObjectId;
  name: string;
};

export type DbSource = {
  url: string;
  extension: BookExtensionsTypes;
};

export type DbBook = {
  readonly type: ResourceTypes.BOOK;
  _id: ObjectId;
  isbn: string;
  title: string;
  edition: number;
  cover: string;
  year: number;
  description?: string;
  authors: ObjectId[];
  categories: ObjectId[];
  tags: ObjectId[];
  contents: DbBookContent[];
  sources: DbSource[];
};

export type DbBookPopulated = {
  readonly type: ResourceTypes.BOOK;
  _id: ObjectId;
  isbn: string;
  title: string;
  edition: number;
  cover: string;
  year: number;
  description?: string;
  authors: DbBookAuthor[];
  categories: DbBookCategory[];
  tags: DbBookTag[];
  contents: DbBookContent[];
  sources: DbSource[];
};
