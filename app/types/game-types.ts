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
    name?: string
  }[]
}

// Indexed access type functionality from TypeScript
export type GameMatch = MatchesDBResponse["data"][number]

export interface StatsResponse {
  success: boolean
  data: {
    rank: string
    emoji: string
    badges: string[]
    stats: {
      totalGames: number
      totalWins: number
      totalLosses: number
      totalDraws: number
      advanced: number
      classic: number
    }
  }
}

export interface DashboardFacetResult {
  favoriteMoveBranch: {
    _id: string
    counter: number
  }[]
  advancedRatioBranch: {
    _id: string
    advancedPercentage: number
  }[]
}

export interface StatsResponseMongoDb {
  _id: string
  advancedCount: number
  classicCount: number
  winCount: number
  lossCount: number
  drawCount: number
}

