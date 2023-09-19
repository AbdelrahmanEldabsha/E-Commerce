import joi from "joi"

export const addBrandSchema = {
  body: joi
    .object({
      name: joi.string().required().min(4).max(25),
    })
    .required(),
  query: joi
    .object({
      categoryId: joi.string().required(),
      subCategoryId: joi.string().required(),
    })
    .required(),
}
