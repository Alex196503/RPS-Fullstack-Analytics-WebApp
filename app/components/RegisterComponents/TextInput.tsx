export const TextInput = ({
  label,
  name,
  placeholder,
  minLength = 3,
  maxLength = 15
}: {
  label: string
  name: string
  placeholder: string
  minLength?: number
  maxLength?: number
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
          type="text"
          name={name}
          id={name}
          required
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-md focus:outline-none focus:border-blue-500 text-white transition-colors"
        />
      </div>
    </>
  )
}
