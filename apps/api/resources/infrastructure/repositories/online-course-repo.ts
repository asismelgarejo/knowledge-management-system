import { IOnlineCourseRepo, OnlineCourseFindErrors, SearchManyProps } from "@/resources/domain/contracts";
import { OnlineCourse, OnlineCourseErrors } from "@/resources/domain/entities";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either, isLeft, right } from "fp-ts/Either";
import { Model, Mongoose } from "mongoose";
import { DbOnlineCourse } from "../schemas/course";
import { CourseSchema } from "../schemas/course-schemas";

export class OnlineCourseRepo implements IOnlineCourseRepo {
  private constructor(private readonly repo: Model<DbOnlineCourse>) {}

  static New(colName: string, db: Mongoose) {
    return new OnlineCourseRepo(db.model<DbOnlineCourse>(colName, CourseSchema));
  }

  async deleteMany(): Promise<boolean> {
    return true;
  }
  async deleteOne(): Promise<boolean> {
    return true;
  }
  async findMany(): Promise<Either<OnlineCourseFindErrors, OnlineCourse[]>> {
    const recordsResp = await this.repo.find().lean().exec();
    const records = [];
    for (const oc of recordsResp) {
      const resp = mapDbToDomain(oc as unknown as DbOnlineCourse);
      if (isLeft(resp)) return resp;
      records.push(resp.right);
    }
    return right(records);
  }

  async search(props: SearchManyProps): Promise<Either<OnlineCourseFindErrors, OnlineCourse[]>> {
    throw new Error("");
  }

  async findOneById(id: Id): Promise<Either<OnlineCourseFindErrors, OnlineCourse>> {
    throw new Error("");
  }
  async insertMany(entities: OnlineCourse[]): Promise<void> {}
  async insertOne(entity: OnlineCourse): Promise<void> {
    const data = mapDomainToDb(entity);
    await this.repo.create(data);
  }
  async update(entity: OnlineCourse): Promise<boolean> {
    return true;
  }
  async updateMany(entities: OnlineCourse[]): Promise<boolean> {
    return true;
  }
}
const mapDbToDomain = (entity: DbOnlineCourse): Either<OnlineCourseErrors | InvalidIdError, OnlineCourse> => {
  const ocIdResp = Id.create();
  if (isLeft(ocIdResp)) return ocIdResp;
  const id = ocIdResp.right;

  const ocResp = OnlineCourse.create({
    id: id,
    name: entity.name,
    contents: [],
  });

  if (isLeft(ocResp)) return ocResp;
  return right(ocResp.right);
};
const mapDomainToDb = (entity: OnlineCourse): DbOnlineCourse => {
  return {
    _id: entity.id.value,
    contents: [],
    name: entity.name,
    type: entity.type,
  };
};
