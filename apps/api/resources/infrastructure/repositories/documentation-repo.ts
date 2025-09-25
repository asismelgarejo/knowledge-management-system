import { DocumentationFindErrors, IDocumentationRepo } from "@/resources/domain/contracts";
import { Documentation, DocumentationErrors } from "@/resources/domain/entities";
import { Id, InvalidIdError } from "@/resources/shared/common-values";
import { Either, isLeft, right } from "fp-ts/Either";
import { Model, Mongoose } from "mongoose";
import { DbDocumentation } from "../schemas/documentation";
import { DocumentationSchema } from "../schemas/documentation-schema";

export class DocumentationRepo implements IDocumentationRepo {
  private constructor(private readonly repo: Model<DbDocumentation>) {}

  static New(colName: string, db: Mongoose) {
    return new DocumentationRepo(db.model<DbDocumentation>(colName, DocumentationSchema));
  }

  async deleteMany(): Promise<boolean> {
    return true;
  }
  async deleteOne(): Promise<boolean> {
    return true;
  }
  async findMany(): Promise<Either<DocumentationFindErrors, Documentation[]>> {
    const recordsResp = await this.repo.find().lean().exec();
    const records = [];
    for (const oc of recordsResp) {
      const resp = mapDbToDomain(oc as unknown as DbDocumentation);
      if (isLeft(resp)) return resp;
      records.push(resp.right);
    }
    return right(records);
  }
  findOneById(id: Id): Promise<Either<DocumentationFindErrors, Documentation>> {
    throw new Error("");
  }
  async insertMany(entities: Documentation[]): Promise<void> {
    throw new Error("");
  }
  async insertOne(entity: Documentation): Promise<void> {
    const data = mapDomainToDb(entity);
    await this.repo.create(data);
  }
  update(entity: Documentation): Promise<boolean> {
    throw new Error("");
  }
  updateMany(entities: Documentation[]): Promise<boolean> {
    throw new Error("");
  }
}
const mapDbToDomain = (entity: DbDocumentation): Either<DocumentationErrors | InvalidIdError, Documentation> => {
  const ocIdResp = Id.create();
  if (isLeft(ocIdResp)) return ocIdResp;
  const id = ocIdResp.right;

  const ocResp = Documentation.create({
    id: id,
    name: entity.name,
    contents: [],
  });

  if (isLeft(ocResp)) return ocResp;
  return right(ocResp.right);
};
const mapDomainToDb = (entity: Documentation): DbDocumentation => {
  return {
    _id: entity.id.value,
    contents: [],
    name: entity.name,
  };
};
