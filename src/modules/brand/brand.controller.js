import { customAlphabet } from "nanoid"
import slugify from "slugify"
import categoryModel from "../../../DB/models/category.model.js"
import subCategoryModel from "../../../DB/models/subCategory.model.js"
import brandModel from "../../../DB/models/brand.model.js"
import { cloudinaryDeleteFolder } from "../../utils/cloudinaryDeleteFolder.js"
import cloudinary from "../../utils/coludinaryConfigrations.js"
const nanoId = customAlphabet("123456_=!ascbhdtel", 5)

export const addBrand = async (req, res, next) => {
  const { name } = req.body
  const { categoryId, subCategoryId } = req.query
  const slug = slugify(name, "-")
  const isCategoryExists = await categoryModel.find({ _id: categoryId })
  const isSubCategoryExists = await subCategoryModel.find({
    _id: subCategoryId,
  })
  console.log(isCategoryExists, isSubCategoryExists)
  if (!isCategoryExists) {
    return next(new Error("Category Not Found", { cause: 404 }))
  }
  if (!isSubCategoryExists) {
    return next(new Error("SubCategory Not Found", { cause: 404 }))
  }
  if (!req.file) {
    return next(new Error("Please upload a logo", { cause: 400 }))
  }
  const customId = nanoId()
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${isSubCategoryExists.customId}/Brand/${customId}`,
    }
  )
  //DB Storing
  const brandObject = {
    name,
    slug,
    categoryId,
    subCategoryId,
    logo: { public_id, secure_url },
    customId,
  }
  const Brand = await brandModel.create(brandObject)
  if (!Brand) {
    cloudinaryDeleteFolder(
      `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${isSubCategoryExists.customId}/Brand/${customId}`
    )
    return next(new Error("Add brand failed", { cause: 400 }))
  }

  res.status(200).json({ message: "Success", Brand })
}
