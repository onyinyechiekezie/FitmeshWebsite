"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Payment {
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

interface Member {
  id: string
  name: string
  email: string
  role: string
  activePlan: string | null
  planExpiresAt: string | null
  createdAt: string
}

interface AdminData {
  members: Member[]
  payments: Payment[]
  stats: {
    totalMembers: number
    totalRevenue: number
    activeSubscriptions: number
    pendingPayments: number
  }
}

export default function AdminPage() {
  const { user } = useAuth()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const response = await fetch("/api/admin/data")
        if (response.ok) {
          const data = await response.json()
          setAdminData(data)
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "admin") {
      fetchAdminData()
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage members and monitor payments
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Logged in as <span className="font-medium text-foreground">{user?.email}</span>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-foreground" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Users className="h-5 w-5 text-foreground" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-foreground">
                        {adminData?.stats.totalMembers || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <DollarSign className="h-5 w-5 text-foreground" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(adminData?.stats.totalRevenue || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <CreditCard className="h-5 w-5 text-foreground" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-foreground">
                        {adminData?.stats.activeSubscriptions || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Clock className="h-5 w-5 text-foreground" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-foreground">
                        {adminData?.stats.pendingPayments || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending Payments</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for Members and Payments */}
              <Tabs defaultValue="payments" className="mt-8">
                <TabsList>
                  <TabsTrigger value="payments">All Payments</TabsTrigger>
                  <TabsTrigger value="members">All Members</TabsTrigger>
                </TabsList>

                {/* Payments Tab */}
                <TabsContent value="payments">
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Payment Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {adminData?.payments && adminData.payments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Member</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Reference</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {adminData.payments.map((payment) => (
                                <tr key={payment.id}>
                                  <td className="py-4 text-sm text-foreground">
                                    {formatDate(payment.createdAt)}
                                  </td>
                                  <td className="py-4">
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{payment.memberName}</p>
                                      <p className="text-xs text-muted-foreground">{payment.memberEmail}</p>
                                    </div>
                                  </td>
                                  <td className="py-4 text-sm font-medium text-foreground">
                                    {payment.planName}
                                  </td>
                                  <td className="py-4 text-sm text-foreground">
                                    {formatCurrency(payment.amount)}
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
                          <p className="mt-4 text-muted-foreground">No payments yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Members Tab */}
                <TabsContent value="members">
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle>Registered Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {adminData?.members && adminData.members.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Member</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Active Plan</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Plan Expires</th>
                                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {adminData.members.map((member) => (
                                <tr key={member.id}>
                                  <td className="py-4">
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                                      <p className="text-xs text-muted-foreground">{member.email}</p>
                                    </div>
                                  </td>
                                  <td className="py-4">
                                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                                      {member.role}
                                    </Badge>
                                  </td>
                                  <td className="py-4 text-sm text-foreground">
                                    {member.activePlan || "None"}
                                  </td>
                                  <td className="py-4 text-sm text-foreground">
                                    {member.planExpiresAt ? formatDate(member.planExpiresAt) : "N/A"}
                                  </td>
                                  <td className="py-4 text-sm text-muted-foreground">
                                    {formatDate(member.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                          <p className="mt-4 text-muted-foreground">No members yet</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
