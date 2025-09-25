import { Schema } from "mongoose";
import { DbAuthor } from "./author";

export const AuthorSchema = new Schema<DbAuthor>({
  _id: Schema.Types.ObjectId,
  first_name: { type: String, required: true },
  last_name_1: { type: String },
  last_name_2: { type: String },
  image: { type: String },
});
