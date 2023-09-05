import mongoose, { Schema, model } from "mongoose"

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    image: {
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
    customId: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)
subCategorySchema.virtual("Brands", {
  ref: "Brand",
  foreignField: "subCategoryId",
  localField: "_id",
})
const subCategoryModel = model("SubCategory", subCategorySchema)
export default subCategoryModel
