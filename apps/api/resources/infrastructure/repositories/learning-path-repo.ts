import { ILearningPathRepo, LearningPathFindErrors } from "@/resources/domain/contracts";
import {
  BookContentTypes,
  CourseContentTypes,
  DocumentationContentTypes,
  LearningPath,
  LearningPathErrors,
  LearningResource,
} from "@/resources/domain/entities";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either, isLeft, right } from "fp-ts/Either";
import { Model, Mongoose } from "mongoose";
import { DbLearningPath, DbLearningResource } from "../schemas/learning-path";
import { LearningPathSchema } from "../schemas/learning-path-schema";

export class LearningPathRepo implements ILearningPathRepo {
  private constructor(private readonly repo: Model<DbLearningPath>) {}

  static New(colName: string, db: Mongoose) {
    return new LearningPathRepo(db.model<DbLearningPath>(colName, LearningPathSchema));
  }

  async deleteMany(): Promise<boolean> {
    return true;
  }
  async deleteOne(): Promise<boolean> {
    return true;
  }
  async findMany(): Promise<Either<LearningPathFindErrors, LearningPath[]>> {
    const learningPathsResp = await this.repo.find().lean().exec();
    const learningPaths = [];
    for (const lp of learningPathsResp) {
      const lpResp = mapDbToDomain(lp);
      if (isLeft(lpResp)) return lpResp;
      learningPaths.push(lpResp.right);
    }
    return right(learningPaths);
  }
  async findOneById(id: Id): Promise<Either<LearningPathFindErrors, LearningPath>> {
    throw new Error("asdasd");
  }
  async insertMany(entities: LearningPath[]): Promise<void> {}
  async insertOne(entity: LearningPath): Promise<void> {
    const data = mapDomainToDb(entity);
    await this.repo.create(data);
  }
  async update(entity: LearningPath): Promise<boolean> {
    return true;
  }
  async updateMany(entities: LearningPath[]): Promise<boolean> {
    return true;
  }
}

const mapDomainToDb = (entity: LearningPath): DbLearningPath => {
  const mapResource = (resource: LearningResource): DbLearningResource => {
    switch (resource.type) {
      case BookContentTypes.CHAPTER: {
        return {
          book: resource.book,
          name: resource.name,
          section: resource.section,
          duration: resource.duration,
          _id: resource.id.value,
          type: resource.type,
          order: resource.order,
        };
      }
      case CourseContentTypes.COURSE_CLASS: {
        return {
          online_course: resource.online_course,
          name: resource.name,
          section: resource.section,
          duration: resource.duration,
          _id: resource.id.value,
          type: resource.type,
          order: resource.order,
        };
      }
      case DocumentationContentTypes.DOCUMENTATION_SUBTOPIC: {
        return {
          documentation: resource.documentation,
          name: resource.name,
          order: resource.order,
          topic: resource.topic,
          duration: resource.duration,
          _id: resource.id.value,
          type: resource.type,
        };
      }
    }
  };

  return {
    _id: entity.id.value,
    initial_date: entity.initialDate,
    resources: entity.resources.map((resource) => mapResource(resource)),
    title: entity.title,
  };
};

const mapDbToDomain = (entity: DbLearningPath): Either<LearningPathErrors | InvalidIdError, LearningPath> => {
  const lpIdResp = Id.create();
  if (isLeft(lpIdResp)) return lpIdResp;
  const lpId = lpIdResp.right;

  const resources: LearningResource[] = [];
  for (const resource of entity.resources) {
    const idResp = Id.create(resource._id.toString());
    if (isLeft(idResp)) return idResp;
    const id = idResp.right;
    switch (resource.type) {
      case BookContentTypes.CHAPTER: {
        resources.push({
          book: resource.book,
          name: resource.name,
          section: resource.section,
          duration: resource.duration,
          id: id,
          type: resource.type,
          order: resource.order,
        });
        break;
      }
      case CourseContentTypes.COURSE_CLASS: {
        resources.push({
          online_course: resource.online_course,
          name: resource.name,
          section: resource.section,
          duration: resource.duration,
          id: id,
          type: resource.type,
          order: resource.order,
        });
        break;
      }
      case DocumentationContentTypes.DOCUMENTATION_SUBTOPIC: {
        resources.push({
          documentation: resource.documentation,
          name: resource.name,
          topic: resource.topic,
          duration: resource.duration,
          id: id,
          type: resource.type,
          order: resource.order,
        });
      }
    }
  }

  const bookResp = LearningPath.create({
    id: lpId,
    initialDate: entity.initial_date,
    title: entity.title,
    resources: resources,
  });

  if (isLeft(bookResp)) return bookResp;
  return right(bookResp.right);
};
