import { NavLink } from "react-router"
import type { NavLinks } from "../../types/layout-types"

export const NavBarLinks = ({
  links,
  mobile
}: {
  links: NavLinks[]
  mobile?: boolean
}) => {
  return (
    <div className={mobile ? "flex flex-col gap-y-6 items-center w-full" : "hidden md:flex items-center justify-center gap-x-7 mx-auto md:w-[600px]"}>
      {links.map((link) => (
        <NavLink
          to={link.route}
          key={link.name}
          className={({ isActive }) =>
            `nav-link ${isActive ? "text-blue-600 font-bold" : !mobile ? "text-gray-600" : "text-white"}`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  )
}
