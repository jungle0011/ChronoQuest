import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"
import { type NextRequest } from "next/server"
import { checkFeatureAccess } from '@/lib/plan-enforcement'
import { z } from 'zod'

// Add error handling wrapper
const handler = createRouteHandler({
  router: ourFileRouter,
})

const UserIdSchema = z.object({ userId: z.string().min(1) })

// Wrap the handlers with error logging
export const GET = async (req: NextRequest) => {
  try {
    console.log("UploadThing GET request received")
    return await handler.GET(req)
  } catch (error) {
    console.error("UploadThing GET error:", error)
    throw error
  }
}

export const POST = async (req: NextRequest) => {
  try {
    // Try to get userId from header (or body if possible)
    const userId = req.headers.get('x-user-id')
    if (!userId) {
      // Optionally, parse body for userId if needed
      // const body = await req.json();
      // const userId = body?.userId;
      return new Response(JSON.stringify({ error: 'Missing userId for plan enforcement.' }), { status: 400 })
    }
    const parseResult = UserIdSchema.safeParse({ userId })
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
    }
    // PLAN ENFORCEMENT: Only allow upload if plan allows
    const { db } = await (await import('@/lib/firebase-admin')).initializeFirebaseAdmin()
    const canUpload = await checkFeatureAccess(userId, 'logoUpload', db)
    if (!canUpload) {
      return new Response(JSON.stringify({ error: 'Your current plan does not allow uploads.' }), { status: 403 })
    }
    return await handler.POST(req)
  } catch (error) {
    console.error('UploadThing POST error:', error instanceof Error ? error.message : error)
    throw error
  }
}
