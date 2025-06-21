const fs = require("fs").promises
const path = require("path")

async function createDataFolder() {
  const dataDir = path.join(process.cwd(), "data")

  try {
    await fs.access(dataDir)
    console.log("Data folder already exists")
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
    console.log("Data folder created successfully")

    // Create a sample business for testing
    const sampleBusiness = {
      id: "sample-123",
      slug: "sample-restaurant",
      fullName: "John Doe",
      businessName: "Sample Restaurant",
      businessDescription: "We serve delicious local and continental dishes",
      productDescription: "Our menu features fresh ingredients and authentic flavors",
      location: "Lagos, Nigeria",
      businessPlan: "We aim to become the leading restaurant in our area",
      logoUrl: "",
      siteStyle: "A",
      contactOption: "both",
      contactNumber: "+234 801 234 5678",
      interestedInPremium: true,
      createdAt: new Date().toISOString(),
    }

    const samplePath = path.join(dataDir, "sample-123.json")
    await fs.writeFile(samplePath, JSON.stringify(sampleBusiness, null, 2))
    console.log("Sample business created")
  }
}

createDataFolder().catch(console.error)
