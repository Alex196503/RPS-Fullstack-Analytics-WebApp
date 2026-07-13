import multer from "multer"
import { cloudinaryVar } from "../../cloudinaryConfig"
import { CloudinaryStorage } from "multer-storage-cloudinary"

//middleware used to create a cloudinary storage for the multer middleware so we can save our images in the cloudinary server
export const uploadMiddleware = (folderName: string) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryVar,
    params: async (req: Request, file: Express.Multer.File) => {
      const publicId = `${file.fieldname}-${Date.now()}`
      return {
        public_id: publicId,
        folder: folderName.trim(),
        format: "webp"
      }
    }
  })
  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  })
}
