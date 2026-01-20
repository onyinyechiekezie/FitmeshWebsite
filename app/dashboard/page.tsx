"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"

interface Payment {
  id: string
  planId: string
  planName: string
  amount: number
  status: "pending" | "successful" | "failed"
  createdAt: string
}

interface MemberData {
  activePlan: string | null
  planExpiresAt: string | null
  membershipStatus: "active" | "expired" | "none"
  payments: Payment[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMemberData() {
      try {
        const response = await fetch("/api/member/data")
        if (response.ok) {
          const data = await response.json()
          setMemberData(data)
        }
      } catch (error) {
        console.error("Failed to fetch member data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMemberData()
    }
  }, [user])

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "successful":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
    }
  }

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "successful":
        return <Badge className="bg-emerald-100 text-emerald-700">Successful</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
    }
  }

  const getMembershipStatusBadge = (status: MemberData["membershipStatus"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "none":
        return <Badge variant="secondary">No Plan</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Fitness Banner */}
          <div className="relative h-32 overflow-hidden rounded-xl sm:h-40">
            <Image
              src="/images/dashboard-banner.jpg"
              alt="Fitness motivation"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 sm:px-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Welcome back, {user?.name?.split(" ")[0] || "Member"}
                </h1>
                <p className="mt-1 text-white/80">
                  Manage your membership and view your payment history
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
            </div>
          ) : (
            <>
              {/* Membership Status Card */}
              <Card className="mt-8 border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Membership Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Plan</p>
                      <p className="mt-1 text-xl font-semibold text-foreground">
                        {memberData?.activePlan || "No Active Plan"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">
                        {getMembershipStatusBadge(memberData?.membershipStatus || "none")}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expires</p>
                      <p className="mt-1 text-lg font-medium text-foreground">
                        {memberData?.planExpiresAt 
                          ? formatDate(memberData.planExpiresAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {(!memberData?.activePlan || memberData.membershipStatus === "expired") && (
                    <div className="mt-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-800">
                          {memberData?.membershipStatus === "expired" 
                            ? "Your membership has expired" 
                            : "You don't have an active membership"}
                        </p>
                        <p className="text-sm text-amber-700">
                          View our plans to get started or renew your membership.
                        </p>
                      </div>
                      <Button asChild size="sm">
                        <Link href="/plans">View Plans</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card className="mt-8 border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {memberData?.payments && memberData.payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Reference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {memberData.payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="py-4 text-sm text-foreground">
                                {formatDate(payment.createdAt)}
                              </td>
                              <td className="py-4 text-sm font-medium text-foreground">
                                {payment.planName}
                              </td>
                              <td className="py-4 text-sm text-foreground">
                                ${payment.amount.toFixed(2)}
                              </td>
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(payment.status)}
                                  {getStatusBadge(payment.status)}
                                </div>
                              </td>
                              <td className="py-4 font-mono text-xs text-muted-foreground">
                                {payment.id}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No payment history yet</p>
                      <Button asChild className="mt-4">
                        <Link href="/plans">View Membership Plans</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
