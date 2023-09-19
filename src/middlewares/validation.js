import joi from "joi"
import { Types } from "mongoose"

const reqMethods = ["body", "query", "params", "headers", "file", "files"]

const validationObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid objectId")
}
export const generalFields = {
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required(),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .messages({
      "string.pattern.base": "Password regex fail",
    })
    .required(),
  _id: joi.string().custom(validationObjectId),
}
export const validationCoreFunction = (schema) => {
  try {
    return (req, res, next) => {
      const validationErrorArr = []
      for (const key of reqMethods) {
        if (schema[key]) {
          const validationResult = schema[key].validate(req[key], {
            abortEarly: false,
          })
          if (validationResult.error) {
            validationErrorArr.push(validationResult.error.details)
          }
        }
      }
      if (validationErrorArr.length) {
        req.error = validationErrorArr
        return next(new Error(``, { cause: 400 }))
      }
      next()
    }
  } catch (err) {
    console.log(err)
  }
}
