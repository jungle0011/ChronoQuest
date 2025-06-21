import { NextResponse } from "next/server"
import { sampleBusinesses } from "@/lib/sample-data"
import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "data")

    // Ensure data directory exists
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Create sample files if they don't exist
    for (const sample of sampleBusinesses) {
      const filePath = path.join(dataDir, `${sample.id}.json`)

      try {
        await fs.access(filePath)
      } catch {
        await fs.writeFile(filePath, JSON.stringify(sample, null, 2))
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sample data initialized",
      samples: sampleBusinesses.length,
    })
  } catch (error) {
    console.error("Error initializing samples:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize sample data",
      },
      { status: 500 },
    )
  }
}
