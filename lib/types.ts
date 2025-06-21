export interface BusinessFormData {
  fullName: string
  businessName: string
  businessDescription: string
  productDescription: string
  location: string
  businessPlan: string
  logoUrl: string
  ownerPictureUrl: string
  siteStyle:
    | "modern"
    | "elegant"
    | "bold"
    | "minimal"
    | "creative"
    | "corporate"
    | "luxury"
    | "neon"
    | "vintage"
    | "glassmorphism"
    | "nature"
  colorScheme: "blue" | "purple" | "green" | "orange" | "red" | "dark" | "gradient" | "gold" | "teal" | "rose" | "slate"
  fontStyle: "modern" | "classic" | "playful" | "professional" | "luxury" | "tech" | "artistic" | "bold"
  layoutStyle: "centered" | "full-width" | "card-based" | "magazine" | "minimal" | "wide"
  contactOption: "whatsapp" | "call" | "both" | "none"
  contactNumber: string
  interestedInPremium: boolean
  // Language Support
  language: "en" | "yo" | "ig" | "ha"
  // Location & Maps
  coordinates?: { lat: number; lng: number }
  showMap: boolean
  fullAddress?: string
  // WhatsApp Settings
  whatsappSettings: {
    welcomeMessage: string
    businessHours: boolean
    autoReply: boolean
    chatPosition: "bottom-right" | "bottom-left"
  }
  // Killer features
  enableAI: boolean
  enableAnalytics: boolean
  enableSEO: boolean
  enableLeadCapture: boolean
  enableBooking: boolean
  enableReviews: boolean
  socialLinks: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
  }
  businessHours: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  customDomain?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  aiGeneratedReviews?: AIGeneratedReview[]
  featuresEnabled?: boolean
  features?: {
    icon: string
    title: string
    description: string
  }[]
  homepageThemes?: HomepageThemeConfig[]
  activeHomepageThemeId?: string
  products?: { name: string; description: string; imageUrl?: string }[]
}

export interface AIGeneratedReview {
  name: string
  rating: number
  comment: string
  location?: string
  verified?: boolean
}

export interface SavedBusiness extends BusinessFormData {
  id: string
  userId: string // Firebase UID
  plan: string // User's subscription plan
  createdAt: string
  updatedAt?: string
  slug: string
  qrCodeUrl?: string
  analytics?: BusinessAnalytics
}

export interface BusinessAnalytics {
  views: number
  clicks: number
  leads: number
  whatsappClicks: number
  phoneClicks: number
  mapClicks: number
  lastVisit: string
  dailyStats: {
    [date: string]: {
      views: number
      clicks: number
      leads: number
    }
  }
  topPages: {
    page: string
    views: number
  }[]
  deviceStats: {
    mobile: number
    desktop: number
    tablet: number
  }
  locationStats: {
    [country: string]: number
  }
}

export interface StyleConfig {
  name: string
  description: string
  preview: string
  bg: string
  primary: string
  secondary: string
  accent: string
  text: string
  hover: string
  cardStyle: string
  buttonStyle: string
  sectionBg: string
}

export interface ColorSchemeConfig {
  name: string
  primary: string
  secondary: string
  accent: string
  bg: string
  text: string
  hover: string
}

export interface FontConfig {
  name: string
  description: string
  headingFont: string
  bodyFont: string
  className: string
}

export interface LayoutConfig {
  name: string
  description: string
  className: string
}

export interface AIGeneratedContent {
  businessDescription?: string
  productDescription?: string
  businessPlan?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

export interface Translation {
  [key: string]: string
}

export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  flag: string
  translations: Translation
}

export interface HomepageThemeConfig {
  id: string; // unique identifier
  name: string;
  description: string;
  previewClass: string; // Tailwind/CSS class for preview
  heroBgClass: string; // class for hero background
  accentClass: string; // accent color class
}
