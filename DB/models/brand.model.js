import mongoose, { Schema } from "mongoose"

const brandSchema = new Schema(
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
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    customId: String,
  },
  { timestamps: true }
)
const brandModel = mongoose.model("Brand", brandSchema)
export default brandModel