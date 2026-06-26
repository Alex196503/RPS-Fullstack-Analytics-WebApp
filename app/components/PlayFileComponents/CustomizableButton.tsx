import type { ButtonProps } from "../../types/layout-types"

export const MenuButton = ({
  name,
  isMenuOpen,
  setMenuOpen
}: ButtonProps) => {
  return (
    <button
      type="button"
      className="px-10 block mx-auto md:ml-auto md:mr-0 cursor-pointer rounded-xl py-2 border-white text-white uppercase tracking-widest font-semibold border-3 hover:bg-sky-600 transition-all duration-300 ease-in-out"
      onClick={() => setMenuOpen(!isMenuOpen)}
    >
      {name}
    </button>
  )
}
