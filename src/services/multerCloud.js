import multer from "multer"
import { allowedExtensions } from "../utils/allowedExtensions.js"

export const multerCloud = (allowedExtensionsArr) => {
  try {
    if (!allowedExtensionsArr) {
      allowedExtensionsArr = allowedExtensions.Image
    }

    const storage = multer.diskStorage({
      filename: function (req, file, cb) {
        const uniqeName = file.originalname
        cb(null, uniqeName)
      },
    })
    const fileFilter = function (req, file, cb) {
      if (allowedExtensionsArr.includes(file.mimetype)) {
        return cb(null, true)
      }
      cb(new Error("Invalid Extension", { cause: 400 }), false)
    }
    const fileUpload = multer({
      fileFilter,
      storage,
    })
    return fileUpload
  } catch (error) {
    console.log(error)
  }
}
