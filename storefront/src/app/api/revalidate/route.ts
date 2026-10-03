import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * Called by the Medusa backend when the owner changes categories, products
 * or stock in the admin. Drops cached pages so the change is live right away.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret")

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  revalidatePath("/", "layout")

  return NextResponse.json({ ok: true, revalidated_at: new Date().toISOString() })
}
