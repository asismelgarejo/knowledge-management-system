import { ObjectId } from "mongodb";

export type DbAuthor = {
  _id: ObjectId;
  first_name: string;
  last_name_1?: string;
  last_name_2?: string;
  image?: string;
};
