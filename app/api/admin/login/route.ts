import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';
import { z } from 'zod';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = LoginSchema.safeParse(body);
    if (!parseResult.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid input' }),
        { status: 400 }
      );
    }
    const { email, password } = parseResult.data;
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, lastAttempt: now };
    if (now - loginAttempts[ip].lastAttempt > WINDOW_MS) {
      loginAttempts[ip] = { count: 0, lastAttempt: now };
    }
    loginAttempts[ip].count++;
    loginAttempts[ip].lastAttempt = now;
    if (loginAttempts[ip].count > MAX_ATTEMPTS) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts. Please try again later.' }),
        { status: 429 }
      );
    }

    // Verify admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = sign(
      { email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    cookies().set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error instanceof Error ? error.message : error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
} 