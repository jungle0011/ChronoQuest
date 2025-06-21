import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    // Check environment variables
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      public_cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    };

    console.log('Cloudinary config check:', {
      cloud_name: config.cloud_name ? 'SET' : 'MISSING',
      api_key: config.api_key ? 'SET' : 'MISSING',
      api_secret: config.api_secret ? 'SET' : 'MISSING',
      public_cloud_name: config.public_cloud_name ? 'SET' : 'MISSING',
      upload_preset: config.upload_preset ? 'SET' : 'MISSING',
    });

    // Test Cloudinary configuration
    if (config.public_cloud_name && config.api_key && config.api_secret) {
      cloudinary.config({
        cloud_name: config.public_cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret,
      });

      return NextResponse.json({
        status: 'success',
        message: 'Cloudinary configuration is valid',
        config: {
          cloud_name: config.public_cloud_name,
          api_key: config.api_key ? '***' + config.api_key.slice(-4) : 'MISSING',
          public_cloud_name: config.public_cloud_name,
          upload_preset: config.upload_preset,
        }
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Missing Cloudinary environment variables',
        config
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Cloudinary configuration test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 