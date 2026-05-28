export const EmailInput = ({
  label,
  name,
  placeholder
}: {
  label: string
  name: string
  placeholder: string
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
          type="email"
          name={name}
          id={name}
          required
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-md focus:outline-none focus:border-blue-500 text-white transition-colors"
        />
      </div>
    </>
  )
}
