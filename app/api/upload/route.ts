import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

// Required .env variables:
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// (Client-side direct uploads use NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.');
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder');
    const folderName = typeof folder === 'string' ? folder : 'uploads';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('Uploading file:', file.name, 'to folder:', folderName);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error: any, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          if (!result) return reject(new Error('No result from Cloudinary'));
          console.log('Cloudinary upload success:', result.secure_url);
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 