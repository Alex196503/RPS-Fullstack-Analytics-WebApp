import { createContext } from "react"
import type { ContextResetProps } from "~/types/game-types"
import { type ToggleThemeProps } from "../../types/layout-types"
// Context to avoid Prop drilling through multiple components, passes some set functions from the parent(GameApp) straight to the play Again button deep in the DOM, bypassing some intermediate components
export const resetContext = createContext<ContextResetProps | null>(
  null
)
//Global context to manage the theme of the app to avoid prop drilling through multiple components
export const ToggleThemeContext =
  createContext<ToggleThemeProps | null>(null)
