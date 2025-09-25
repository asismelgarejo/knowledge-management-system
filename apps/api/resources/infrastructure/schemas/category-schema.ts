import { Schema } from "mongoose";
import { DbCategory } from "./category";

export const CategorySchema = new Schema<DbCategory>({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true },
});
