import { useState } from "react"
import { Outlet, useLocation, useOutletContext } from "react-router"
import { MenuButton } from "~/components/PlayFileComponents/CustomizableButton"
export default function FooterLayout() {
  const url = useLocation()
  const isAdvanced = url.pathname.toLowerCase().includes("advanced")
  const buttonName = isAdvanced ? "Rules" : "Menu"
  const [isMenuOpen, setMenuOpen] = useState(false)
  const { score, setScore } =
    useOutletContext<{
      score: number
      setScore: React.Dispatch<React.SetStateAction<number>>
    }>() || {}
  return (
    <div>
      <Outlet
        context={{ isMenuOpen, setMenuOpen, score, setScore }}
      />
      <footer className="w-full px-6 md:px-8 py-7 mt-5">
        <MenuButton
          name={buttonName}
          isMenuOpen={isMenuOpen}
          setMenuOpen={setMenuOpen}
        />
      </footer>
    </div>
  )
}
