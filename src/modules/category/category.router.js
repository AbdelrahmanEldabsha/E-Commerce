import { Router } from "express"
import * as cc from "./category.controller.js"
import { asyncHandler } from "../../utils/errorhandling.js"
import { multerCloud } from "../../services/multerCloud.js"
import { allowedExtensions } from "../../utils/allowedExtensions.js"
import * as validators from "./category.validationSchema.js"
import { validationCoreFunction } from "../../middlewares/validation.js"
const router = Router()

router.post(
  "/",
  multerCloud(allowedExtensions.Image).single("image"),
  validationCoreFunction(validators.createCategorySchema),
  asyncHandler(cc.createCategory)
)
router.put(
  "/:categoryId",
  multerCloud(allowedExtensions.Image).single("image"),
  validationCoreFunction(validators.updateCategorySchema),
  asyncHandler(cc.updateCategory)
)
router.delete(
  "/deleteCategory/:categoryId",
  multerCloud(allowedExtensions.Image).single("image"),
  validationCoreFunction(validators.updateCategorySchema),
  asyncHandler(cc.deleteCategory)
)
router.get("/getAllCategories", asyncHandler(cc.getAllCategories))
export default router
