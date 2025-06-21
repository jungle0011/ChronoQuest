"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Section {
  id: string
  label: string
}

interface SectionNavBarProps {
  sections: Section[]
  buttonStyle: string
}

export function SectionNavBar({ sections, buttonStyle }: SectionNavBarProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const sectionsElements = sections.map((s) => document.getElementById(s.id))

      // Sticky logic
      if (window.scrollY > 200) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }

      // Active section logic
      let currentSection = ""
      for (let i = sectionsElements.length - 1; i >= 0; i--) {
        const section = sectionsElements[i]
        if (section && section.offsetTop <= scrollPosition + 120) {
          currentSection = sections[i].id
          break
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [sections])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // Adjust for sticky nav height
        behavior: "smooth",
      })
    }
  }

  return (
    <nav
      className={cn(
        "z-50 w-full transition-all duration-300",
        isSticky
          ? "fixed top-0 left-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-md"
          : "relative bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16 space-x-2 md:space-x-4 overflow-x-auto">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "whitespace-nowrap transition-colors duration-200",
                buttonStyle,
                activeSection === section.id
                  ? "text-primary-foreground bg-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {section.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
} 