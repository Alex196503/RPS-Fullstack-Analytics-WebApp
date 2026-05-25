import { NavBarLinks } from "./NavBarLinks"
import { Link } from "react-router"
import { FaBars } from "react-icons/fa"
import { globalLinks } from "~/config/gameConfig"
import { MenuMobile } from "./MenuMobile"
import { useEffect, useState } from "react"
import useMenuResponsiveClose, {
  useThemeContext
} from "~/utils/custom-hooks"
export const Navbar = () => {
  const [isOpen, setMenuOpen] = useState(false)
  useMenuResponsiveClose(isOpen, setMenuOpen)
  const { isDark, setDark } = useThemeContext()
  return (
    <>
      <nav className="w-full rounded-sm h-13 py-4 px-6 bg-gray-100 flex justify-between items-center">
        <div className="w-[200px] md:w-[300px] flex items-center">
          <Link to="/" className="logo-link">
            Game App
          </Link>
        </div>
        <NavBarLinks links={globalLinks} mobile={false} />
        <div className="w-[200px] md:w-[300px] flex items-center justify-end">
          <FaBars
            onClick={() => setMenuOpen(!isOpen)}
            className="text-2xl block md:hidden cursor-pointer"
          />
          <label className="items-center cursor-pointer hidden md:inline-flex">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={() => setDark(!isDark)}
            />
            <div className="relative  w-9 h-5 bg-gray-400 peer-focus:outline-none  peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
            <span className="select-none ms-3 text-sm font-medium text-heading">
              Dark/Light theme
            </span>
          </label>
        </div>
        {isOpen && (
          <MenuMobile setMenuOpen={setMenuOpen} isOpen={isOpen} />
        )}
      </nav>
    </>
  )
}
