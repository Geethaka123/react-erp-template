import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { flushSync } from "react-dom"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDark = document.documentElement.classList.contains("dark")
    setTheme(isDark ? "dark" : "light")
  }, [])

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = theme === "dark"
    const newTheme = isDark ? "light" : "dark"

    // Fallback for browsers that don't support View Transitions
    if (!document.startViewTransition) {
      setTheme(newTheme)
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(newTheme)
      localStorage.setItem("vite-ui-theme", newTheme)
      return
    }

    // Get the click position
    const x = event.clientX
    const y = event.clientY
    
    // Calculate the distance to the farthest corner
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(newTheme)
        localStorage.setItem("vite-ui-theme", newTheme)
      })
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )

      // Also set CSS variables as backup
      document.documentElement.style.setProperty('--ripple-x', `${x}px`)
      document.documentElement.style.setProperty('--ripple-y', `${y}px`)
      document.documentElement.style.setProperty('--ripple-r', `${endRadius}px`)
    })
  }

  if (!mounted) return <div className="w-10 h-10" />

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
        <Sun 
          className={`
            h-full w-full transition-all duration-500 ease-in-out text-amber-500
            ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `} 
        />
        <Moon 
          className={`
            absolute h-full w-full transition-all duration-500 ease-in-out text-blue-400
            ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `} 
        />
      </div>
      <span className="sr-only">Toggle {isDark ? "light" : "dark"} mode</span>
    </Button>
  )
}
