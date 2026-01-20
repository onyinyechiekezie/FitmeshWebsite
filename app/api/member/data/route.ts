import { NextResponse } from "next/server"
import { getSession, users } from "@/lib/auth"
import { getMemberPayments } from "@/lib/data-store"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get user data
    const user = users.find(u => u.id === session.id)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get payment history
    const payments = getMemberPayments(session.id)

    // Determine membership status
    let membershipStatus: "active" | "expired" | "none" = "none"
    if (user.activePlan && user.planExpiresAt) {
      const expirationDate = new Date(user.planExpiresAt)
      if (expirationDate > new Date()) {
        membershipStatus = "active"
      } else {
        membershipStatus = "expired"
      }
    }

    return NextResponse.json({
      activePlan: user.activePlan || null,
      planExpiresAt: user.planExpiresAt || null,
      membershipStatus,
      payments: payments.map(p => ({
        id: p.id,
        planId: p.planId,
        planName: p.planName,
        amount: p.amount,
        status: p.status,
        createdAt: p.createdAt
      }))
    })
  } catch (error) {
    console.error("Error fetching member data:", error)
    return NextResponse.json(
      { error: "Failed to fetch member data" },
      { status: 500 }
    )
  }
}
