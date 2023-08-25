import { Router } from "express"
import { multerCloud } from "../../services/multerCloud.js"
import { allowedExtensions } from "../../utils/allowedExtensions.js"
import { asyncHandler } from "../../utils/errorhandling.js"
import * as bc from "./brand.controller.js"
import { validationCoreFunction } from "../../middlewares/validation.js"
import { addBrandSchema } from "./brand.validationSchema.js"

const router = Router()
router.post(
  "/",

  multerCloud(allowedExtensions.Image).single("logo"),
  validationCoreFunction(addBrandSchema),
  asyncHandler(bc.addBrand)
)
export default router
