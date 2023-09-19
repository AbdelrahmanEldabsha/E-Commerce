import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"

export const addProductSchema = {
  body: joi
    .object({
      name: joi.string().required().min(4).max(25),
      description: joi.string().required().min(4).max(225),
      colors: joi.array().items(joi.string().required()).optional(),
      sizes: joi.array().items(joi.string().required()).optional(),
      price: joi.number().positive().min(1).required(),
      appliedDiscount: joi.number().positive().min(1).max(100).optional(), //how
      stock: joi.number().integer().positive().required(),
    })
    .required(),
  query: joi
    .object({
      categoryId: generalFields._id,
      subCategoryId: generalFields._id,
      brandId: generalFields._id,
    })
    .options({ presence: "required" }),
}
export const updateProductSchema = {
  body: joi
    .object({
      name: joi.string().min(4).max(25).optional(),
      description: joi.string().min(4).max(225).optional(),
      colors: joi.array().items(joi.string().required()).optional(),
      sizes: joi.array().items(joi.string().required()).optional(),
      price: joi.number().positive().min(1).optional(),
      appliedDiscount: joi.number().positive().min(1).max(100).optional(), //how
      stock: joi.number().integer().positive().optional(),
    })
    .required(),
  query: joi.object({
    categoryId: generalFields._id,
    subCategoryId: generalFields._id,
    brandId: generalFields._id,
    productId: generalFields._id.required(),
  }),
}
