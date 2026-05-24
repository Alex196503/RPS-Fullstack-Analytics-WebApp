import { createContext } from "react"
import { type ContextResetProps } from "~/types/types"
// Context to avoid Prop drilling through multiple components, passes some set functions from the parent(GameApp) straight to the play Again button deep in the DOM, bypassing some intermediate components
export const resetContext = createContext<ContextResetProps | null>(
  null
)
