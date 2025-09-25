import { DocumentationContentTypes } from "@/resources/domain/entities";
import { ObjectId } from "mongodb";

export type DbDocumentationSubtopic = {
  id: ObjectId;
  name: string;
  readonly type: DocumentationContentTypes.DOCUMENTATION_SUBTOPIC;
  duration: number;
  notes: string[];
};

export type DbDocumentationTopic = {
  id: ObjectId;
  name: string;
  readonly type: DocumentationContentTypes.DOCUMENTATION_TOPIC;
  classes: DbDocumentationSubtopic[];
};

export type DbDocumentationContent = DbDocumentationSubtopic | DbDocumentationTopic;

export type DbDocumentation = {
  _id: ObjectId;
  name: string;
  contents: DbDocumentationContent[];
};
