import { ObjectId } from "mongodb";

export type DbCategory = {
  _id: ObjectId;
  name: string;
};
