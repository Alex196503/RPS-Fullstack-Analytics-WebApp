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
  return (
    <>
      <div className="form-container">
        <label
          className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-1"
          htmlFor={name}
        >
          {label}
        </label>
        <input
          type="file"
          name={name}
          id={name}
          accept={accept}
          onChange={(e) => {
            if (typeof onChange === "function") {
              onChange(e)
            }
          }}
          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-md focus:outline-none focus:border-blue-500 text-white transition-colors"
        />
      </div>
    </>
  )
}
