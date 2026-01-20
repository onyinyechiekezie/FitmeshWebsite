import { NextResponse } from "next/server"
import { getSession, users } from "@/lib/auth"
import { getAllPayments } from "@/lib/data-store"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    // Get all payments
    const payments = getAllPayments()

    // Get all members (exclude password hashes)
    const members = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      activePlan: user.activePlan || null,
      planExpiresAt: user.planExpiresAt || null,
      createdAt: user.createdAt
    }))

    // Calculate stats
    const totalMembers = users.filter(u => u.role === "member").length
    const totalRevenue = payments
      .filter(p => p.status === "successful")
      .reduce((sum, p) => sum + p.amount, 0)
    const activeSubscriptions = users.filter(u => {
      if (!u.activePlan || !u.planExpiresAt) return false
      return new Date(u.planExpiresAt) > new Date()
    }).length
    const pendingPayments = payments.filter(p => p.status === "pending").length

    return NextResponse.json({
      members,
      payments,
      stats: {
        totalMembers,
        totalRevenue,
        activeSubscriptions,
        pendingPayments
      }
    })
  } catch (error) {
    console.error("Error fetching admin data:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    )
  }
}
