import slugify from "slugify"
import categoryModel from "../../../DB/models/category.model.js"
import { customAlphabet } from "nanoid"
import cloudinary from "../../utils/coludinaryConfigrations.js"
import subCategoryModel from "../../../DB/models/subCategory.model.js"
import { cloudinaryDeleteFolder } from "../../utils/cloudinaryDeleteFolder.js"
// Create a custom nanoid generator
const nanoId = customAlphabet("123456_=!ascbhdtel", 5)

// API endpoint handler to create a subCategory
export const createSubCategory = async (req, res, next) => {
  const { name } = req.body
  const { categoryId } = req.params
  const slug = slugify(name, "-")

  const isCategoryExists = await categoryModel.findById({ _id: categoryId })
  if (!isCategoryExists) {
    return next(new Error("invalid CategoryId", { cause: 400 }))
  }
  // Check if subcategory name already exists
  const isSubCategoryExists = await subCategoryModel.findOne({ name })
  if (isSubCategoryExists) {
    return next(
      new Error("Please enter a different subcategory name", { cause: 400 })
    )
  }
  // Check if a subCategory image was uploaded
  if (!req.file) {
    return next(new Error("Please upload a subCategory image", { cause: 400 }))
  }

  // Generate a custom ID for the subCategory
  const customId = nanoId()

  // Upload subCategory image to Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${customId}`,
    }
  )
  // Construct the category data to be saved in the database
  const subCategoryData = {
    name,
    slug,
    image: {
      secure_url,
      public_id,
    },
    customId,
    categoryId,
  }
  const subCategory = await subCategoryModel.create(subCategoryData)
  //   Handle subCategory creation failure
  if (!subCategory) {
    // If subCategory creation fails, delete the uploaded image from Cloudinary
    // await cloudinary.uploader.destroy(public_id)
    cloudinaryDeleteFolder(
      `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${customId}`
    )
    return next(
      new Error("Failed to create subCategory, please try again later", {
        cause: 400,
      })
    )
  }

  res
    .status(201)
    .json({ message: "subCategory created successfully", subCategory })
}
export const updateSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params
  const { name } = req.body
  var subCategoryData = await subCategoryModel.findById({
    _id: subCategoryId,
  })
  const categoryData = await categoryModel.findById({
    _id: subCategoryData.categoryId,
  })
  if (!subCategoryData) {
    return next(
      new Error("Invalid subCategory id: subCategory not found", { cause: 400 })
    )
  }
  if (name) {
    if (name.toLowerCase() == subCategoryData.name) {
      return next(new Error("please enter different name", { cause: 400 }))
    }
    if (await subCategoryModel.findOne({ name })) {
      return next(
        new Error("please enter different subCategory name , duplicate name", {
          cause: 400,
        })
      )
    }
    subCategoryData.name = name
    subCategoryData.slug = slugify(name, "-")
  }
  if (req.file) {
    await cloudinary.uploader.destroy(subCategoryData.image.public_id)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce/Category/${categoryData.customId}/subCategory/${subCategoryData.customId}`,
      }
    )
    subCategoryData.image = { secure_url, public_id }
  }
  if (!(name || req.file)) {
    return next(new Error("Enter either name or image or both", { cause: 400 }))
  }
  await subCategoryData.save()
  res.status(200).json({ message: "Updated Done", subCategoryData })
}
export const getAllSubCategories = async (req, res, next) => {
  const SubCategories = await subCategoryModel.find().populate([
    {
      path: "categoryId",
      select: "slug",
    },
  ])
  if (!SubCategories) {
    return next(new Error("No Sub Categories Found", { cause: 404 }))
  }
  res.status(200).json({ message: "All SubCategories", SubCategories })
}

export const deleteSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params
  const isSubCategoryExists = await subCategoryModel.findById({
    _id: subCategoryId,
  })
  if (!isSubCategoryExists) {
    return next(
      new Error("Invalid subcategory id: subcategory not found", { cause: 400 })
    )
  }
  const categoryData = await categoryModel.findById({
    _id: isSubCategoryExists.categoryId,
  })

  cloudinaryDeleteFolder(
    `E-Commerce/Category/${categoryData.customId}/subCategory/${isSubCategoryExists.customId}`
  )
  const deletedSubCategory = await subCategoryModel.deleteOne({
    _id: subCategoryId,
  })
  res
    .status(200)
    .json({ message: "Category deleted sucessfully", deletedSubCategory })
}
