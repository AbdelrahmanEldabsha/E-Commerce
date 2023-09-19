import { Router } from "express"
import { multerCloud } from "../../services/multerCloud.js"
import { allowedExtensions } from "../../utils/allowedExtensions.js"
import { asyncHandler } from "../../utils/errorhandling.js"
import * as pc from "./product.controller.js"
import { validationCoreFunction } from "../../middlewares/validation.js"
import { addProductSchema, updateProductSchema } from "./product.validation.js"
const router = Router()

router.post(
  "/",
  multerCloud(allowedExtensions.Image).array("images", 2),
  validationCoreFunction(addProductSchema),
  asyncHandler(pc.addProduct)
)
router.get("/", asyncHandler(pc.getAllproducts))
router.put(
  "/",
  multerCloud(allowedExtensions.Image).array("images", 2),
  validationCoreFunction(updateProductSchema),
  asyncHandler(pc.updateProduct)
)
export default router
