import { Link } from "react-router"
import { NavBarLinks } from "./NavBarLinks"
import { globalLinks } from "../../config/gameConfig"
export const MenuMobile = ({
  setMenuOpen,
  isOpen
}: {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
}) => {
  return (
    <>
      <section className="fixed w-full h-full inset-0 bg-black/50 z-40 md:hidden">
        <div className="fixed top-0 right-0 h-full w-full z-index-20 bg-black p-6 shadow-2xl flex flex-col gap-6">
          <div className="w-full flex items-center justify-between">
            <Link to="/" className="logo-link">
              Game App
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              className="cursor-pointer text-white hover:text-gray-200 transition-colors duration-200 ease-in-out"
              viewBox="0 0 20 20"
              onClick={() => {
                if (isOpen) {
                  setMenuOpen(false)
                }
              }}
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M16.97 0l2.122 2.121-7.425 7.425 7.425 7.425-2.121 2.12-7.425-7.424-7.425 7.425L0 16.97l7.425-7.425L0 2.121 2.121 0l7.425 7.425L16.971 0z"
              />
            </svg>
          </div>
          <div className="w-full flex flex-col gap-y-6 items-center">
            <NavBarLinks links={globalLinks} mobile={true} />
          </div>
          <label className="items-center justify-center  cursor-pointer inline-flex md:inline-flex select-none">
            <input type="checkbox" className="sr-only peer" />
            <div className="relative w-10 h-5 bg-zinc-700 border border-zinc-600 rounded-full peer peer-checked:bg-indigo-500 peer-focus:outline-none after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full transition-colors duration-200"></div>
            <span className="ms-3 text-sm font-semibold text-white tracking-wide">
              Dark/Light theme
            </span>
          </label>
        </div>
      </section>
    </>
  )
}
