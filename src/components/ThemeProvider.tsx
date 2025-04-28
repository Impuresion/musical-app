
import { createContext, useContext, useEffect } from "react"
import { 
  initializeThemeColors, 
  initializeSunriseGradient 
} from "@/utils/themeUtils"

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: "dark"
}

const initialState: ThemeProviderState = {
  theme: "dark",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light")
    root.classList.add("dark")
    
    const savedHue = localStorage.getItem("theme-accent-hue") || "271"
    initializeThemeColors(Number(savedHue), true)
    initializeSunriseGradient(Number(savedHue), 100, true) // Fixed opacity at 100
  }, [])

  return (
    <ThemeProviderContext.Provider {...props} value={initialState}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
