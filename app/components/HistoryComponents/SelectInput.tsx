export const SelectInput = ({
  filter,
  onChange,
  options,
  label
}: {
  filter: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement, Element>) => void
  options: string[]
  label: string
}) => {
  return (
    <>
      <form className="max-w-sm mx-auto">
        <label
          htmlFor="select"
          className="block mb-2.5 text-sm font-medium text-heading"
        >
          {label}
        </label>
        <select
          id="select"
          className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:bg-black focus:border-brand shadow-xs placeholder:text-body"
          value={filter}
          onChange={onChange}
        >
          {" "}
          {options.map((option, index) => {
            return (
              <option key={index} value={option}>
                {option}
              </option>
            )
          })}
        </select>
      </form>
    </>
  )
}
