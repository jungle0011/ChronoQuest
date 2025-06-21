// AI Content Generation Service

export interface AIGeneratedContent {
  businessDescription: string
  productDescription: string
  businessPlan: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

export interface AIGeneratedReview {
  name: string
  rating: number
  comment: string
  location?: string
  verified?: boolean
}

export async function generateBusinessContent(businessName: string, industry: string): Promise<AIGeneratedContent> {
  // Simulate AI content generation (in production, this would call OpenAI/Claude API)
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const templates = {
    restaurant: {
      businessDescription: `${businessName} is a premier dining destination offering exceptional culinary experiences with fresh, locally-sourced ingredients and outstanding service.`,
      productDescription: `We specialize in authentic cuisine prepared by expert chefs, featuring seasonal menus that celebrate local flavors and international influences.`,
      businessPlan: `Our mission is to create memorable dining experiences while supporting local farmers and suppliers. We focus on quality, sustainability, and customer satisfaction.`,
      metaTitle: `${businessName} - Authentic Dining Experience | Fresh Local Cuisine`,
      metaDescription: `Experience exceptional dining at ${businessName}. Fresh ingredients, expert chefs, and outstanding service. Book your table today!`,
      keywords: ["restaurant", "dining", "fresh food", "local cuisine", businessName.toLowerCase()],
    },
    tech: {
      businessDescription: `${businessName} delivers cutting-edge technology solutions that empower businesses to thrive in the digital age through innovation and expertise.`,
      productDescription: `We provide comprehensive tech services including software development, digital transformation, cloud solutions, and IT consulting tailored to your business needs.`,
      businessPlan: `We aim to be the leading technology partner for businesses seeking digital excellence. Our focus is on delivering scalable, secure, and innovative solutions.`,
      metaTitle: `${businessName} - Technology Solutions | Software Development & IT Services`,
      metaDescription: `Transform your business with ${businessName}'s expert technology solutions. Software development, cloud services, and IT consulting.`,
      keywords: ["technology", "software", "IT services", "digital transformation", businessName.toLowerCase()],
    },
    default: {
      businessDescription: `${businessName} is dedicated to providing exceptional products and services that exceed customer expectations and deliver outstanding value.`,
      productDescription: `We offer high-quality solutions designed to meet your specific needs, backed by professional expertise and commitment to excellence.`,
      businessPlan: `Our goal is to build lasting relationships with customers by consistently delivering superior value and maintaining the highest standards of service.`,
      metaTitle: `${businessName} - Quality Products & Professional Services`,
      metaDescription: `Discover exceptional products and services at ${businessName}. Quality, reliability, and customer satisfaction guaranteed.`,
      keywords: ["quality", "professional", "services", "reliable", businessName.toLowerCase()],
    },
  }

  // Simple industry detection
  const detectedIndustry =
    industry.toLowerCase().includes("restaurant") || industry.toLowerCase().includes("food")
      ? "restaurant"
      : industry.toLowerCase().includes("tech") || industry.toLowerCase().includes("software")
        ? "tech"
        : "default"

  return templates[detectedIndustry as keyof typeof templates]
}

export async function generateCustomerReviews(
  businessName: string,
  businessType: string,
  count = 6,
): Promise<AIGeneratedReview[]> {
  // Simulate AI review generation
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const nigerianNames = [
    "Adebayo Johnson",
    "Chioma Okafor",
    "Ibrahim Musa",
    "Funmi Adeyemi",
    "Emeka Nwankwo",
    "Aisha Abdullahi",
    "Tunde Ogundimu",
    "Blessing Okoro",
    "Yusuf Garba",
    "Ngozi Eze",
    "Kemi Adebisi",
    "Chinedu Obi",
    "Fatima Hassan",
    "Segun Afolabi",
    "Grace Udoh",
    "Ahmed Bello",
    "Folake Oni",
    "Chukwuma Ike",
    "Zainab Aliyu",
    "Biodun Ogundipe",
  ]

  const reviewTemplates = {
    restaurant: [
      "The food here is absolutely amazing! Fresh ingredients and authentic flavors. Will definitely be back!",
      "Best dining experience I've had in Lagos. The service was exceptional and the atmosphere perfect.",
      "Outstanding cuisine and friendly staff. This place never disappoints!",
      "Incredible flavors and presentation. You can taste the quality in every bite.",
      "Perfect spot for family dinner. Great food, reasonable prices, and excellent service.",
      "The chef really knows what they're doing. Every dish was perfectly prepared and delicious.",
    ],
    tech: [
      "Professional service and cutting-edge solutions. They transformed our business operations completely.",
      "Excellent technical expertise and customer support. Highly recommend for any tech needs.",
      "They delivered exactly what we needed on time and within budget. Very impressed!",
      "Outstanding software development skills. Our new system works flawlessly.",
      "Great team to work with. They understood our requirements and exceeded expectations.",
      "Reliable, professional, and innovative. Best tech partner we've worked with.",
    ],
    beauty: [
      "Amazing service! I left feeling absolutely beautiful and confident.",
      "Professional staff and high-quality products. My skin has never looked better!",
      "Relaxing atmosphere and excellent treatments. This is my go-to beauty spot.",
      "Outstanding results every time. The staff really knows their craft.",
      "Clean, professional, and affordable. Highly recommend to everyone!",
      "Best beauty services in the area. Always leave feeling pampered and refreshed.",
    ],
    retail: [
      "Great quality products at reasonable prices. Excellent customer service too!",
      "Wide selection and helpful staff. They always have what I'm looking for.",
      "Reliable supplier with consistent quality. Been shopping here for years.",
      "Fast delivery and products exactly as described. Very satisfied customer!",
      "Competitive prices and genuine products. Trustworthy business to deal with.",
      "Excellent shopping experience. Quality products and friendly service.",
    ],
    default: [
      "Exceptional service and quality. Highly recommend to anyone looking for reliable solutions.",
      "Professional, efficient, and trustworthy. They exceeded all my expectations.",
      "Outstanding customer service and attention to detail. Will definitely use again.",
      "Great value for money and excellent results. Very satisfied with their service.",
      "Reliable and professional team. They delivered exactly what they promised.",
      "Top-notch service and quality. This business really cares about their customers.",
    ],
  }

  // Detect business type
  const type =
    businessType.toLowerCase().includes("restaurant") || businessType.toLowerCase().includes("food")
      ? "restaurant"
      : businessType.toLowerCase().includes("tech") || businessType.toLowerCase().includes("software")
        ? "tech"
        : businessType.toLowerCase().includes("beauty") || businessType.toLowerCase().includes("spa")
          ? "beauty"
          : businessType.toLowerCase().includes("shop") || businessType.toLowerCase().includes("store")
            ? "retail"
            : "default"

  const templates = reviewTemplates[type as keyof typeof reviewTemplates]
  const locations = ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", "Jos", "Enugu", "Warri", "Calabar"]

  const reviews: AIGeneratedReview[] = []

  for (let i = 0; i < count; i++) {
    const name = nigerianNames[Math.floor(Math.random() * nigerianNames.length)]
    const comment = templates[Math.floor(Math.random() * templates.length)]
    const rating = Math.random() > 0.1 ? 5 : 4 // 90% 5-star, 10% 4-star
    const location = locations[Math.floor(Math.random() * locations.length)]

    reviews.push({
      name,
      rating,
      comment,
      location,
      verified: Math.random() > 0.3, // 70% verified
    })
  }

  return reviews
}

export async function generateQRCode(url: string): Promise<string> {
  // In production, this would generate an actual QR code
  // For now, we'll use a QR code API service
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  return qrApiUrl
}
