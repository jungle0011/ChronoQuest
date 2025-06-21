const fs = require("fs").promises
const path = require("path")

// Import sample data (we'll recreate it here to avoid import issues)
const sampleBusinesses = [
  {
    id: "sample-restaurant-1",
    slug: "fresh-bites-restaurant",
    fullName: "Adebayo Johnson",
    businessName: "Fresh Bites Restaurant",
    businessDescription:
      "We serve delicious local and continental dishes made with fresh, locally-sourced ingredients in a warm, welcoming atmosphere.",
    productDescription:
      "Our menu features authentic Nigerian cuisine alongside international favorites, prepared by expert chefs with passion for culinary excellence.",
    location: "Victoria Island, Lagos",
    businessPlan:
      "Our mission is to become Lagos' premier dining destination by combining traditional Nigerian flavors with modern culinary techniques, while supporting local farmers and suppliers.",
    logoUrl: "",
    siteStyle: "elegant",
    colorScheme: "orange",
    fontStyle: "classic",
    layoutStyle: "centered",
    contactOption: "both",
    contactNumber: "+234 801 234 5678",
    interestedInPremium: true,
    enableAI: true,
    enableAnalytics: true,
    enableSEO: true,
    enableLeadCapture: true,
    enableBooking: true,
    enableReviews: true,
    socialLinks: {
      facebook: "https://facebook.com/freshbitesrestaurant",
      instagram: "@freshbiteslagos",
    },
    businessHours: {
      monday: "10:00 AM - 10:00 PM",
      tuesday: "10:00 AM - 10:00 PM",
      wednesday: "10:00 AM - 10:00 PM",
      thursday: "10:00 AM - 10:00 PM",
      friday: "10:00 AM - 11:00 PM",
      saturday: "9:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM",
    },
    keywords: ["restaurant", "Nigerian cuisine", "Lagos dining", "fresh food"],
    aiGeneratedReviews: [
      {
        name: "Chioma Okafor",
        rating: 5,
        comment:
          "The food here is absolutely amazing! Fresh ingredients and authentic flavors. Will definitely be back!",
        location: "Lagos",
        verified: true,
      },
      {
        name: "Ibrahim Musa",
        rating: 5,
        comment: "Best dining experience I've had in Lagos. The service was exceptional and the atmosphere perfect.",
        location: "Abuja",
        verified: true,
      },
      {
        name: "Funmi Adeyemi",
        rating: 4,
        comment: "Outstanding cuisine and friendly staff. This place never disappoints!",
        location: "Lagos",
        verified: false,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-tech-2",
    slug: "tech-solutions-hub",
    fullName: "Emeka Nwankwo",
    businessName: "Tech Solutions Hub",
    businessDescription:
      "We deliver cutting-edge technology solutions that empower businesses to thrive in the digital age through innovation and expertise.",
    productDescription:
      "Comprehensive tech services including software development, digital transformation, cloud solutions, and IT consulting tailored to your business needs.",
    location: "Lekki, Lagos",
    businessPlan:
      "We aim to be the leading technology partner for Nigerian businesses seeking digital excellence, focusing on delivering scalable, secure, and innovative solutions.",
    logoUrl: "",
    siteStyle: "modern",
    colorScheme: "blue",
    fontStyle: "tech",
    layoutStyle: "card-based",
    contactOption: "both",
    contactNumber: "+234 802 345 6789",
    interestedInPremium: true,
    enableAI: true,
    enableAnalytics: true,
    enableSEO: true,
    enableLeadCapture: true,
    enableBooking: true,
    enableReviews: true,
    socialLinks: {
      linkedin: "https://linkedin.com/company/techsolutionshub",
      twitter: "@techsolutionshub",
    },
    businessHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 2:00 PM",
    },
    keywords: ["technology", "software development", "IT consulting", "digital transformation"],
    aiGeneratedReviews: [
      {
        name: "Aisha Abdullahi",
        rating: 5,
        comment:
          "Professional service and cutting-edge solutions. They transformed our business operations completely.",
        location: "Abuja",
        verified: true,
      },
      {
        name: "Tunde Ogundimu",
        rating: 5,
        comment: "Excellent technical expertise and customer support. Highly recommend for any tech needs.",
        location: "Lagos",
        verified: true,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "sample-beauty-3",
    slug: "beauty-wellness-spa",
    fullName: "Blessing Okoro",
    businessName: "Beauty & Wellness Spa",
    businessDescription:
      "Your premier destination for beauty treatments, wellness services, and relaxation in a serene, professional environment.",
    productDescription:
      "We offer a full range of beauty services including facials, massages, hair treatments, nail care, and wellness therapies using premium products.",
    location: "Ikeja, Lagos",
    businessPlan:
      "To become Lagos' most trusted beauty and wellness destination by providing exceptional services that enhance our clients' natural beauty and well-being.",
    logoUrl: "",
    siteStyle: "luxury",
    colorScheme: "rose",
    fontStyle: "luxury",
    layoutStyle: "centered",
    contactOption: "whatsapp",
    contactNumber: "+234 803 456 7890",
    interestedInPremium: true,
    enableAI: true,
    enableAnalytics: true,
    enableSEO: true,
    enableLeadCapture: true,
    enableBooking: true,
    enableReviews: true,
    socialLinks: {
      instagram: "@beautywellnessspa",
      facebook: "https://facebook.com/beautywellnessspa",
    },
    businessHours: {
      monday: "9:00 AM - 7:00 PM",
      tuesday: "9:00 AM - 7:00 PM",
      wednesday: "9:00 AM - 7:00 PM",
      thursday: "9:00 AM - 7:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "8:00 AM - 8:00 PM",
      sunday: "10:00 AM - 6:00 PM",
    },
    keywords: ["beauty spa", "wellness", "massage", "facial treatments", "Lagos"],
    aiGeneratedReviews: [
      {
        name: "Ngozi Eze",
        rating: 5,
        comment: "Amazing service! I left feeling absolutely beautiful and confident.",
        location: "Lagos",
        verified: true,
      },
      {
        name: "Kemi Adebisi",
        rating: 5,
        comment: "Professional staff and high-quality products. My skin has never looked better!",
        location: "Lagos",
        verified: true,
      },
    ],
    createdAt: new Date().toISOString(),
  },
]

async function setupSamples() {
  const dataDir = path.join(process.cwd(), "data")

  try {
    // Ensure data directory exists
    await fs.access(dataDir)
    console.log("✅ Data folder exists")
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
    console.log("✅ Data folder created")
  }

  // Create sample files
  for (const sample of sampleBusinesses) {
    const filePath = path.join(dataDir, `${sample.id}.json`)

    try {
      // Check if file already exists
      await fs.access(filePath)
      console.log(`✅ Sample exists: ${sample.businessName}`)
    } catch {
      // File doesn't exist, create it
      await fs.writeFile(filePath, JSON.stringify(sample, null, 2))
      console.log(`✅ Created sample: ${sample.businessName}`)
    }
  }

  console.log("🎉 All sample data setup complete!")
}

setupSamples().catch(console.error)
