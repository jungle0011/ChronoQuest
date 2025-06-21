import type { HomepageThemeConfig } from "./types";

export const HOMEPAGE_THEMES: HomepageThemeConfig[] = [
  {
    id: "vibrant-gradient",
    name: "Vibrant Gradient",
    description: "A lively animated gradient background with bold accent.",
    previewClass: "bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400",
    heroBgClass: "bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 animate-gradient-slow",
    accentClass: "text-pink-600",
  },
  {
    id: "calm-blues",
    name: "Calm Blues",
    description: "Soft blue tones for a professional, calming look.",
    previewClass: "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400",
    heroBgClass: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-300",
    accentClass: "text-blue-700",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange and yellow hues for a welcoming feel.",
    previewClass: "bg-gradient-to-br from-yellow-200 via-orange-300 to-pink-400",
    heroBgClass: "bg-gradient-to-br from-yellow-100 via-orange-200 to-pink-200",
    accentClass: "text-orange-600",
  },
  {
    id: "minty-fresh",
    name: "Minty Fresh",
    description: "Cool mint and teal for a fresh, modern vibe.",
    previewClass: "bg-gradient-to-br from-teal-100 via-green-200 to-cyan-200",
    heroBgClass: "bg-gradient-to-br from-teal-50 via-green-100 to-cyan-100",
    accentClass: "text-teal-600",
  },
  {
    id: "classic-light",
    name: "Classic Light",
    description: "Minimal, clean white with subtle gray accents.",
    previewClass: "bg-gradient-to-br from-white via-gray-100 to-gray-200",
    heroBgClass: "bg-gradient-to-br from-white via-gray-50 to-gray-100",
    accentClass: "text-gray-700",
  },
]; 