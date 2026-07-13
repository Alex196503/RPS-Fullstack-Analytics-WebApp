import { useEffect, useState } from "react"
import LogoBonus from "../../images/image-victor.jpg"
export const UploadInputPreview = ({
  imageUploaded,
  handleRemoveImage
}: {
  imageUploaded: File
  handleRemoveImage: () => void
}) => {
  const [previewUrl, setPreviewUrl] = useState("")
  useEffect(() => {
    const objectUrl = URL.createObjectURL(imageUploaded)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [imageUploaded])
  return (
    <div className="mt-2 flex items-center gap-4 p-3 bg-gray-950 border border-gray-800 rounded-lg">
      <img
        src={
          previewUrl && previewUrl.trim() !== ""
            ? previewUrl
            : LogoBonus
        }
        alt="Avatar preview"
        className="w-16 h-16 object-cover rounded-full border border-gray-700"
      />

      <section className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 truncate max-w-[180px]">
          {imageUploaded && imageUploaded?.name}
        </span>
        <button
          type="button"
          className="text-left text-xs font-semibold text-red-400 hover:text-red-300 transition-colors w-fit focus:outline-none"
          onClick={handleRemoveImage}
          data-testid="remove"
        >
          Remove Image
        </button>
      </section>
    </div>
  )
}
