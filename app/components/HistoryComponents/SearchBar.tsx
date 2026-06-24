export const SearchBar = ({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) => {
  return (
    <>
      <label
        htmlFor="search"
        className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 max-w-[400px] mb-3 mx-auto"
      >
        {label}
      </label>
      <input
        id="search"
        type="text"
        placeholder="Search battle city..."
        value={value}
        onChange={onChange}
        className="w-full max-w-[400px] block mx-auto px-4 py-3 text-sm text-slate-100 bg-slate-900 border border-slate-800 rounded-xl placeholder-slate-500 outline-none transition-all focus:border-sky-400 focus:bg-slate-950 focus:ring-2 focus:ring-sky-400/15"
      />
    </>
  )
}
