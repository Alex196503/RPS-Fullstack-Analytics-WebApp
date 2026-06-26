export interface TitleComponentsProps {
  components: string[]
}

export interface ParameterContainerProps {
  title: string
  value: number
}

export type ModalProps = {
  name: string
  menu: string
  isMenuOpen?: boolean
  setMenuOpen: (isOpen: boolean) => void
}

export type ButtonProps = {
  name: string
  isMenuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type GameOutletContextProps = {
  score?: number | null
  setScore?: React.Dispatch<React.SetStateAction<number | null>>
  isMenuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type NavLinks = {
  name: string
  route: string
}

export type ToggleThemeProps = {
  isDark: boolean
  setDark: React.Dispatch<React.SetStateAction<boolean>>
}

export type ProfileBadgeProps = {
  name: string
  bgColor: string
  textColor: string
  borderColor: string
}
