import cloudinary from "./coludinaryConfigrations.js"
export const cloudinaryDeleteFolder = async (folderPath) => {
  const allResources = await cloudinary.api.resources({
    type: "upload",
    prefix: folderPath, // The folder path you want to delete
  })
  for (const resource of allResources.resources) {
    await cloudinary.uploader.destroy(resource.public_id)
  }
  const x = await cloudinary.api.delete_folder(folderPath)
  return x
}
