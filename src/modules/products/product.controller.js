import slugify from "slugify"
import productModel from "../../../DB/models/Product.model.js"
import brandModel from "../../../DB/models/brand.model.js"
import categoryModel from "../../../DB/models/category.model.js"
import subCategoryModel from "../../../DB/models/subCategory.model.js"
import { customAlphabet } from "nanoid"
import cloudinary from "../../utils/coludinaryConfigrations.js"
import { cloudinaryDeleteFolder } from "../../utils/cloudinaryDeleteFolder.js"
const nanoId = customAlphabet("123456_=!ascbhdtel", 5)

export const addProduct = async (req, res, next) => {
  //get data from user
  const { name, description, colors, sizes, price, appliedDiscount, stock } =
    req.body
  const slug = slugify(name, "-")
  const customId = nanoId()

  const { categoryId, subCategoryId, brandId } = req.query
  //check if categories exists or not
  const isCategoryExists = await categoryModel.findById({
    _id: categoryId,
  })
  if (!isCategoryExists) {
    return next(
      new Error("Wrong related categoriy Id ", {
        cause: 404,
      })
    )
  }
  const isSubCategoryExists = await subCategoryModel.findById({
    _id: subCategoryId,
  })
  if (!isSubCategoryExists) {
    return next(
      new Error("Wrong related subcategoriy Id ", {
        cause: 404,
      })
    )
  }
  const isBrandExists = await brandModel.findById({
    _id: brandId,
  })
  if (!isBrandExists) {
    return next(
      new Error("Wrong related brand Id ", {
        cause: 404,
      })
    )
  }

  //calculate price after discount
  const priceAfterDiscount =
    price - price * ((appliedDiscount ? appliedDiscount : 0) / 100)
  /*******************************************************************************************/
  //store pics to cloudinary
  if (!req.files) {
    return next(new Error("Please upload at least an Image", { cause: 400 }))
  }
  console.log(req.files)
  try {
    const Images = []
    for (let file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${isSubCategoryExists.customId}/Brand/${isBrandExists.customId}/Products/${customId}`,
        }
      )
      Images.push({ public_id, secure_url })
    }
    /******************************************************************** */
    //store product data in DB

    const productObj = {
      name,
      slug,
      description,
      colors,
      sizes,
      price,
      appliedDiscount,
      priceAfterDiscount,
      stock,
      categoryId,
      subCategoryId,
      brandId,
      Images,
      customId,
    }
    const product = await productModel.create(productObj)

    //if storing in db failed, delete uploaded files from cloudinary
    if (!product) {
      cloudinaryDeleteFolder(
        `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${isSubCategoryExists.customId}/Brand/${isBrandExists.customId}/Products/${customId}`
      )
      return next(new Error("try again later", { cause: 400 }))
    }
    res.status(201).json({ message: "Product created syccessfully", product })
  } catch (error) {
    cloudinaryDeleteFolder(
      `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${isSubCategoryExists.customId}/Brand/${isBrandExists.customId}/Products/${customId}`
    )
    return next(new Error("try again later", { cause: 400 }))
  }
}

export const updateProduct = async (req, res, next) => {
  const { name, description, colors, sizes, price, appliedDiscount, stock } =
    req.body
  if (name) {
    var slug = slugify(name, "-")
  }

  const { productId, categoryId, subCategoryId, brandId } = req.query

  const isProductExist = await productModel.findById(productId)
  if (!isProductExist) {
    return next(new Error("Product not found, Enter valid ID", { cause: 404 }))
  }
  if (categoryId) {
    var isCategoryExists = await categoryModel.findById({
      _id: categoryId,
    })
    if (!isCategoryExists) {
      return next(
        new Error("Wrong related categoriy Id ", {
          cause: 404,
        })
      )
    }
    isProductExist.categoryId = categoryId
  }
  if (subCategoryId) {
    var isSubCategoryExists = await subCategoryModel.findById({
      _id: subCategoryId,
    })
    if (!isSubCategoryExists) {
      return next(
        new Error("Wrong related subcategoriy Id ", {
          cause: 404,
        })
      )
    }
    isProductExist.subCategoryId = subCategoryId
  }
  if (brandId) {
    var isBrandExists = await brandModel.findById({
      _id: brandId,
    })
    if (!isBrandExists) {
      return next(
        new Error("Wrong related brand Id ", {
          cause: 404,
        })
      )
    }
    isProductExist.brandId = brandId
  }

  if (price && appliedDiscount) {
    isProductExist.priceAfterDiscount =
      price * (1 - (appliedDiscount ? appliedDiscount : 0) / 100)
    isProductExist.price = price
    isProductExist.appliedDiscount = appliedDiscount
  } else if (price) {
    isProductExist.priceAfterDiscount =
      price *
      (1 -
        (isProductExist.appliedDiscount ? isProductExist.appliedDiscount : 0) /
          100)
    isProductExist.price = price
  } else if (appliedDiscount) {
    isProductExist.priceAfterDiscount =
      isProductExist.price * (1 - (appliedDiscount ? appliedDiscount : 0) / 100)
    isProductExist.appliedDiscount = appliedDiscount
  }

  if (req.files?.length) {
    let Images = []
    let public_ids = []
    for (let file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `E-Commerce/Category/${isCategoryExists.customId}/subCategory/${isSubCategoryExists.customId}/Brand/${isBrandExists.customId}/Products/${isProductExist.customId}`,
        }
      )
      Images.push({ secure_url, public_id })
    }
    for (let image of isProductExist.Images) {
      public_ids.push(image.public_id)
    }
    //remove old images from cloudinary
    await cloudinary.api.delete_resources(public_ids)
    isProductExist.Images = Images
  }
  // if (name) isProductExist.name = name
  // if (slug) isProductExist.slug = slug
  name ? (isProductExist.name = name) : 0
  slug ? (isProductExist.slug = slug) : 0
  description ? (isProductExist.description = description) : 0
  colors ? (isProductExist.colors = colors) : 0
  sizes ? (isProductExist.sizes = sizes) : 0
  stock ? (isProductExist.stock = stock) : 0

  await isProductExist.save()
  res.status(200).json({ message: "Done", Product: isProductExist })
}
