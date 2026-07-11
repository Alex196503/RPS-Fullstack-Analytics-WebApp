import { useState, useRef } from "react"
import { UploadInputPreview } from "./UploadInputPreview"

export const UploadInput = ({
  label,
  name,
  accept,
  onChange
}: {
  label: string
  name: string
  accept: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  let [imageUploaded, setUploadedImage] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const handleRemoveImage = () => {
    // CRITICAL STATE SYNC: Clicking 'Remove' updates our local UI, but DOES NOT fire a native HTML 'change' event. We mock a minimal valid event object to clean it up.

    if (inputRef.current) {
      inputRef.current.value = ""
    }
    setUploadedImage(null)
    if (typeof onChange === "function") {
      const simulatedEvent = {
        target: {
          name: name,
          value: "",
          files: null
        }
      } as React.ChangeEvent<HTMLInputElement>
      onChange(simulatedEvent)
    }
  }
  return (
    <>
      <div className="form-container flex flex-col gap-2">
        <label
          className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-1"
          htmlFor={name}
        >
          {label}
        </label>
        <input
          type="file"
          name={name}
          ref={inputRef}
          id={name}
          accept={accept}
          onChange={(e) => {
            if (typeof onChange === "function") {
              onChange(e)
            }
            const file = (e.target as HTMLInputElement).files?.[0]
            setUploadedImage(file as File)
          }}
          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-md focus:outline-none focus:border-blue-500 text-white transition-colors"
        />
        {imageUploaded && (
          <UploadInputPreview
            imageUploaded={imageUploaded}
            handleRemoveImage={handleRemoveImage}
          />
        )}
      </div>
    </>
  )
}
