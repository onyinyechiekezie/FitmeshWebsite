import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAllPayments } from "@/lib/data-store"

// GET - List all payments (admin only)
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    if (session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      )
    }

    const payments = getAllPayments()

    return NextResponse.json({
      success: true,
      payments,
      total: payments.length
    })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    )
  }
}
