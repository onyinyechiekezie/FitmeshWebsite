// Shared data store for payments and members
// In a real app, this would be stored in a database

export interface Payment {
  id: string
  planId: string
  planName: string
  amount: number
  memberId: string
  memberName: string
  memberEmail: string
  status: "pending" | "successful" | "failed"
  createdAt: string
}

// In-memory storage for payments
export const payments: Payment[] = []

// Helper to get payments for a specific member
export function getMemberPayments(memberId: string): Payment[] {
  return payments
    .filter(p => p.memberId === memberId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Helper to get all payments (for admin)
export function getAllPayments(): Payment[] {
  return [...payments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}
