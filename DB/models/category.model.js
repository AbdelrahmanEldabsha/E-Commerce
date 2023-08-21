import mongoose, { Schema } from "mongoose"

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      uniqe: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      uniqe: true,
      lowercase: true,
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
      required: false, //will Be Changed after user model
    },
    customId: String,
  },
  { timestamps: true }
)
const categoryModel = mongoose.model("Category", categorySchema)
export default categoryModel
