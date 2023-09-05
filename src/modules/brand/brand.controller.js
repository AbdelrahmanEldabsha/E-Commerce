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
  const isCategoryExists = await categoryModel.findOne({ _id: categoryId })
  const isSubCategoryExists = await subCategoryModel.findOne({
    _id: subCategoryId,
  })
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

  res.status(201).json({ message: "Success", Brand })
}

export const updateBrand = async (req, res, next) => {
  const { brandId } = req.query
  const { name } = req.body
  const isBrandExists = await brandModel.findById({ _id: brandId })
  const categoryData = await categoryModel.findById({
    _id: isBrandExists.categoryId,
  })
  const subCategoryData = await subCategoryModel.findById({
    _id: isBrandExists.subCategoryId,
  })
  if (!isBrandExists) {
    return next(new Error("Brand Not Found", { cause: 404 }))
  }
  if (!name && !req.file) {
    return next(new Error("Please change name or logo", { cause: 400 }))
  }
  if (name) {
    isBrandExists.name = name
    isBrandExists.slug = slugify(name, "-")
  }
  if (req.file) {
    const deleteStatus = await cloudinary.uploader.destroy(
      isBrandExists.logo.public_id
    )
    if (!deleteStatus) {
      return next(new Error("failed to update logo", { cause: 400 }))
    }

    var { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E-Commerce/Category/${categoryData.customId}/subCategory/${subCategoryData.customId}/Brand/${isBrandExists.customId}`,
      }
    )
    isBrandExists.logo = { public_id, secure_url }
  }

  await isBrandExists.save()
  res.status(200).json({ message: "Success", isBrandExists })
}

export const getAllBrands = async (req, res, next) => {
  const Brands = await brandModel.find().populate([
    { path: "categoryId", select: "name" },
    { path: "subCategoryId", select: "name" },
  ])
  if (!Brands) {
    return next(new Error("No Sub Categories Found", { cause: 404 }))
  }
  res.status(200).json({ message: "All Brands", Brands })
}
export const deleteBrand = async (req, res, next) => {
  const { brandId } = req.query
  const isBrandExist = await brandModel.findById({ _id: brandId })
  console.log(isBrandExist)
  if (!isBrandExist) {
    return next(new Error("Brand Not Found", { cause: 404 }))
  }
  const category = await categoryModel.findById({
    _id: isBrandExist.categoryId,
  })
  const subCategory = await subCategoryModel.findById({
    _id: isBrandExist.subCategoryId,
  })
  //delete from cloudinary
  const x = cloudinaryDeleteFolder(
    `E-Commerce/Category/${category.customId}/subCategory/${subCategory.customId}/Brand/${isBrandExist.customId}`
  )
  console.log(x)
  //Delete Brand from DB
  const deletedBrand = await brandModel.deleteOne({ _id: brandId })
  if (!deletedBrand.deletedCount) {
    return next(new Error("DB Delete Failed", { cause: 404 }))
  }
  res.status(200).json({ message: "Deleted Successfully ", deletedBrand })
}
