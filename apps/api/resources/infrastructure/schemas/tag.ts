import { ObjectId } from "mongodb";

export type DbTag = {
  _id: ObjectId;
  name: string;
};
