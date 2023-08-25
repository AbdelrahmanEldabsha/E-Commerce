import { Router } from "express"
import * as sc from "./subCategory.controller.js"
import { asyncHandler } from "../../utils/errorhandling.js"
import { multerCloud } from "../../services/multerCloud.js"
import { allowedExtensions } from "../../utils/allowedExtensions.js"
import * as validators from "./subCategory.validationSchema.js"
import { validationCoreFunction } from "../../middlewares/validation.js"
const router = Router()

router.post(
  "/:categoryId",
  multerCloud(allowedExtensions.Image).single("image"),
  validationCoreFunction(validators.createSubCategorySchema),
  asyncHandler(sc.createSubCategory)
)
router.put(
  "/:subCategoryId",
  multerCloud(allowedExtensions.Image).single("image"),
  validationCoreFunction(validators.updateSubCategorySchema),
  asyncHandler(sc.updateSubCategory)
)
router.get("/", asyncHandler(sc.getAllSubCategories))
router.delete(
  "/deleteSubCategory/:subCategoryId",
  multerCloud(allowedExtensions.Image).single("image"),
  validationCoreFunction(validators.deleteSubCategorySchema),
  asyncHandler(sc.deleteSubCategory)
)
export default router
