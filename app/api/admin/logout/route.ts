import { NextResponse } from 'next/server';

export async function POST() {
  const response = new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return response;
} 