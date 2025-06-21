import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadToCloudinary(file: File): Promise<string> {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing')
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  try {
    console.log("Uploading to Cloudinary...")
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error("Cloudinary upload failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Cloudinary upload successful:", data.secure_url)
    return data.secure_url
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to upload image")
  }
}
