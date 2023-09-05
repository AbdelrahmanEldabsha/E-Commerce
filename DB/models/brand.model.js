import mongoose, { Schema, model } from "mongoose"

const brandSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // TODO: convert into true after creating usermodel
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    customId: String,
  },
  { timestamps: true }
)
const brandModel = model("Brand", brandSchema)
export default brandModel
