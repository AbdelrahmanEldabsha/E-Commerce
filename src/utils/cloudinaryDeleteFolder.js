import cloudinary from "./coludinaryConfigrations.js"
export const cloudinaryDeleteFolder = async (folderPath) => {
  // const allResources = await cloudinary.api.resources({
  //   type: "upload",
  //   prefix: folderPath, // The folder path you want to delete
  // })
  // for (const resource of allResources.resources) {
  //   await cloudinary.uploader.destroy(resource.public_id)
  // }
  try {
    await cloudinary.api.delete_resources_by_prefix(folderPath)

    const x = await cloudinary.api.delete_folder(folderPath)
    return x
  } catch (error) {
    console.log(error)
    // return next(new Error("failed to delete cloudinary files", { cause: 400 }))
  }
}
