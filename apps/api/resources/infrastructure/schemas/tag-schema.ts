import { Schema } from "mongoose";
import { DbTag } from "./tag";

export const TagSchema = new Schema<DbTag>({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
});
