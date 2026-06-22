export interface TitleComponentsProps {
  components: string[]
}
export interface ParameterContainerProps {
  title: string
  value: number
}
export type ContainerType = {
  id: number
  bgColor: string
  shadowColor: string
  extraProps?: string
}
export type SVGType = {
  width: string
  height: string
  path: string
}
export type BadgeData = {
  container: ContainerType
  svg: SVGType
  customProperties?: string
  name: string
  advancedProperties?: string
}
export interface GameBadgeProps {
  item: BadgeData
  menu: "custom" | "advanced" | "classic"
  onClick?: () => void
  isDuelMode?: boolean
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

export interface GameDuelProps {
  indexChoice: number
  GameBadges: BadgeData[]
  menu: "classic" | "custom" | "advanced"
  choice: string
  HouseChoice: number | null
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

export interface GameResultContainerProps {
  message: string
  HouseChoiceMessage: string | null
  choice: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
}

export interface ContextResetProps {
  setChoice: React.Dispatch<React.SetStateAction<string>>
  setHouseChoice: React.Dispatch<React.SetStateAction<number | null>>
  setMessage: React.Dispatch<React.SetStateAction<string>>
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

export type FormData = {
  username: string | null
  email: string | null
  password: string | null
  confirmPassword?: string | null
  avatar: string
}

export type UserProps = {
  username: string
  email: string
  avatar: string
  createdAt?: string
}

export type User = Pick<
  FormData,
  "email" | "password" | "avatar" | "username"
> & { id: string }

export interface InitialData {
  username: string
  email: string
  avatar?: string
}

export interface EditProfileResponse {
  message: string
  success: boolean
  data?: {
    username: string
    email: string
    avatar: string
  }
  errors?: {
    [key: string]: string[]
  }
}

export interface ScoreDBResponse {
  message: string
  scores: {
    classic: { totalScore: number }
    advanced: { totalScore: number }
  }
  success: boolean
}

export interface ScoreReqBody {
  outcome: string
  gamemode: string
  playerMove: string
  opponentMove: string
  result: string
}

export interface MatchesDBResponse {
  success: boolean
  message: string
  data: {
    _id: string
    user: string
    playerMove: string
    opponentMove: string
    result: "win" | "loss" | "draw"
    mode: "classic" | "advanced"
    createdAt: string
  }[]
}

//Indexed access type functionality from TypeScript used here!
export type GameMatch = MatchesDBResponse["data"][number]
