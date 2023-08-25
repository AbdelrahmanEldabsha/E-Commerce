import joi from "joi"

export const createSubCategorySchema = {
  body: joi
    .object({
      name: joi.string().required().min(4).max(25),
    })
    .required(),
  params: joi.object({
    categoryId: joi.string().required(),
  }),
}
export const updateSubCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(4).max(25),
    })
    .required(),
  params: joi.object({
    subCategoryId: joi.string().required(),
  }),
}

export const deleteSubCategorySchema = {
  params: joi.object({
    subCategoryId: joi.string().required(),
  }),
}
