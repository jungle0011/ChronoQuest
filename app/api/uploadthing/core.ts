import { createUploadthing, type FileRouter } from "uploadthing/next"

// Initialize UploadThing with proper error handling
const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      try {
        // Log the request for debugging
        console.log("Upload request received")
        
        // You can add authentication here if needed
        return { userId: "user" }
      } catch (error) {
        console.error("Upload middleware error:", error)
        throw new Error("Failed to process upload request")
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        console.log("Upload complete for userId:", metadata.userId)
        console.log("File details:", {
          name: file.name,
          size: file.size,
          url: file.url
        })
        return { uploadedBy: metadata.userId, url: file.url }
      } catch (error) {
        console.error("Upload complete error:", error)
        throw new Error("Failed to complete upload")
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
