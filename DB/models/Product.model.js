import { Schema, model } from "mongoose"

export const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: String,
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    colors: [String],
    sizes: [String],
    price: { type: Number, required: true, default: 1 },
    appliedDiscount: { type: Number, default: 0 },
    priceAfterDiscount: { type: Number, default: 0 },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // TODO: convert into true after creating usermodel
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    Images: [
      {
        secure_url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    customId: String,
  },
  { timestamps: true }
)

const productModel = model("Product", productSchema)
export default productModel