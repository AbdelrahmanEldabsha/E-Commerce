import slugify from "slugify"
import categoryModel from "../../../DB/models/category.model.js"
import { customAlphabet } from "nanoid"
import cloudinary from "../../utils/coludinaryConfigrations.js"
import { cloudinaryDeleteFolder } from "../../utils/cloudinaryDeleteFolder.js"
import subCategoryModel from "../../../DB/models/subCategory.model.js"

// Create a custom nanoid generator
const nanoId = customAlphabet("123456_=!ascbhdtel", 5)

// API endpoint handler to create a category
export const createCategory = async (req, res, next) => {
  const { name } = req.body
  const slug = slugify(name, "-")

  // Check if category name already exists
  const isCategoryExists = await categoryModel.findOne({ name })
  if (isCategoryExists) {
    return next(
      new Error("Please enter a different category name", { cause: 400 })
    )
  }

  // Check if a category image was uploaded
  if (!req.file) {
    return next(new Error("Please upload a category image", { cause: 400 }))
  }

  // Generate a custom ID for the category
  const customId = nanoId()

  // Upload category image to Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce/Category/${customId}`,
    }
  )

  // Construct the category data to be saved in the database
  const categoryData = {
    name,
    slug,
    image: {
      secure_url,
      public_id,
    },
    customId,
  }

  // Create the category in the database
  const category = await categoryModel.create(categoryData)

  // Handle category creation failure

  if (!category) {
    // // If category creation fails, delete the uploaded image from Cloudinary
    // //this method only deletes the asset and leaves the folder

    // await cloudinary.uploader.destroy(public_id)

    // // this fun delete all assets within the folder and sub folders then delete all folders
    const x = cloudinaryDeleteFolder(`E-Commerce/Category/${customId}`)

    return next(
      new Error("Failed to create category, please try again later", {
        cause: 400,
      })
    )
  }

  res.status(201).json({ message: "Category created successfully", category })
}

export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params
  const { name } = req.body
  const categoryData = await categoryModel.findById({ _id: categoryId })
  if (!categoryData) {
    return next(
      new Error("Invalid category id: category not found", { cause: 400 })
    )
  }
  if (name) {
    if (name.toLowerCase() == categoryData.name) {
      return next(new Error("please enter different name", { cause: 400 }))
    }
    if (await categoryModel.findOne({ name })) {
      return next(
        new Error("please enter different category name , duplicate name", {
          cause: 400,
        })
      )
    }
    categoryData.name = name
    categoryData.slug = slugify(name, "-")
  }
  if (req.file) {
    await cloudinary.uploader.destroy(categoryData.image.public_id)
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce/Category/${categoryData.customId}`,
      }
    )
    categoryData.image = { secure_url, public_id }
  }
  if (!(name || req.file)) {
    return next(new Error("Enter either name or image or both", { cause: 400 }))
  }
  await categoryData.save()
  res.status(200).json({ message: "Updated Done", categoryData })
}

export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params
  //search for categeroy in database
  const isCategoryExists = await categoryModel.findById({ _id: categoryId })
  //check if category exists
  if (!isCategoryExists) {
    return next(
      new Error("Invalid category id: category not found", { cause: 400 })
    )
  }
  //delete category folder and assets from cloudinary
  cloudinaryDeleteFolder(`E-Commerce/Category/${isCategoryExists.customId}`)
  //delete al sub categories related to this category
  const deletedSubCategories = await subCategoryModel.deleteMany({ categoryId })
  const deletedCategory = await categoryModel.deleteOne({ _id: categoryId })
  res.status(200).json({
    message: "Category deleted sucessfully and all its' sub categories",
    deletedCategory,
  })
}
export const getAllCategories = async (req, res, next) => {
  const Categories = await categoryModel
    .find()
    .populate([{ path: "SubCategories" }]) // using virtuals
  if (!Categories) {
    new Error("No categories found", {
      cause: 400,
    })
  }
  console.log(Categories)
  // const allCategoriesData = []
  // for (const category of Categories) {
  //   const relatedsubCategories = await subCategoryModel.find({
  //     categoryId: category._id,
  //   })
  //   const categeroyobj = category.toObject()
  //   categeroyobj.subCategories = relatedsubCategories
  //   allCategoriesData.push(categeroyobj)
  // }
  res.status(200).json({ message: "success", Categories })
}
