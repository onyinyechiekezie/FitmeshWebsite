import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null
      })
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: session
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get session" },
      { status: 500 }
    )
  }
}
