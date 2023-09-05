import { Router } from "express"
import { multerCloud } from "../../services/multerCloud.js"
import { allowedExtensions } from "../../utils/allowedExtensions.js"
import { asyncHandler } from "../../utils/errorhandling.js"
import * as pc from "./product.controller.js"
const router = Router()

router.post(
  "/",
  multerCloud(allowedExtensions.Image).array("images",2),
  asyncHandler(pc.addProduct)
)
router.put(
  "/",
  multerCloud(allowedExtensions.Image).array("images",2),
  asyncHandler(pc.updateProduct)
)
export default router
