import joi from "joi"

export const createCategorySchema = {
  body: joi
    .object({
      name: joi.string().required().min(4).max(25),
    })
    .required(),
}
export const updateCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(4).max(25),
    })
    .required(),
  params: joi.object({
    categoryId: joi.string().required(),
  }),
}

export const deleteCategorySchema = {
  params: joi.object({
    categoryId: joi.string().required(),
  }),
}
