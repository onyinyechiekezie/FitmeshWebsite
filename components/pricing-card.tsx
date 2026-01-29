// "use client"
//
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Check, Loader2, Type as type, LucideIcon } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useAuth } from "@/components/auth-provider"
//
// interface Plan {
//   id: string
//   name: string
//   price: number
//   period: string
//   description: string
//   features: string[]
//   popular?: boolean
//   icon?: LucideIcon
// }
//
// interface PricingCardProps {
//   plan: Plan
// }
//
// export function PricingCard({ plan }: PricingCardProps) {
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
//   const { user } = useAuth()
//   const router = useRouter()
//
//   async function handlePayment() {
//     if (!user) {
//       router.push("/login?redirect=/plans")
//       return
//     }
//
//     setLoading(true)
//     setMessage(null)
//
//     try {
//       const response = await fetch("/api/payments/initiate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           planId: plan.id,
//           planName: plan.name,
//           amount: plan.price,
//         }),
//       })
//
//       const data = await response.json()
//
//       if (response.ok) {
//         setMessage({
//           type: "success",
//           text: `Payment successful! Reference: ${data.paymentId}`,
//         })
//       } else {
//         setMessage({ type: "error", text: data.error || "Payment failed" })
//       }
//     } catch (error) {
//       setMessage({ type: "error", text: "Failed to process payment" })
//     } finally {
//       setLoading(false)
//     }
//   }
//
//   return (
//     <Card
//       className={cn(
//         "relative flex flex-col border-border bg-card",
//         plan.popular && "border-2 border-foreground"
//       )}
//     >
//       {plan.popular && (
//         <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//           <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-primary-foreground">
//             Most Popular
//           </span>
//         </div>
//       )}
//
//       <CardHeader className="p-6 pb-0">
//         {plan.icon && (
//           <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
//             <plan.icon className="h-5 w-5 text-foreground" />
//           </div>
//         )}
//         <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
//         <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
//         <div className="mt-4">
//           <span className="text-4xl font-bold text-foreground">${plan.price}</span>
//           <span className="text-muted-foreground">/{plan.period}</span>
//         </div>
//       </CardHeader>
//
//       <CardContent className="flex-1 p-6">
//         <ul className="space-y-3">
//           {plan.features.map((feature) => (
//             <li key={feature} className="flex items-start gap-3">
//               <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
//               <span className="text-sm text-muted-foreground">{feature}</span>
//             </li>
//           ))}
//         </ul>
//       </CardContent>
//
//       <CardFooter className="flex flex-col gap-3 p-6 pt-0">
//         <Button
//           onClick={handlePayment}
//           disabled={loading}
//           className={cn(
//             "w-full",
//             plan.popular
//               ? "bg-foreground text-primary-foreground hover:bg-foreground/90"
//               : "bg-transparent"
//           )}
//           variant={plan.popular ? "default" : "outline"}
//         >
//           {loading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Processing...
//             </>
//           ) : user ? (
//             "Pay Now"
//           ) : (
//             "Sign in to Pay"
//           )}
//         </Button>
//
//         {message && (
//           <p
//             className={cn(
//               "text-center text-sm",
//               message.type === "success" ? "text-emerald-600" : "text-destructive"
//             )}
//           >
//             {message.text}
//           </p>
//         )}
//       </CardFooter>
//     </Card>
//   )
// }
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Check,
    Loader2,
    Clock,
    Calendar,
    CalendarDays,
    CalendarRange,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

/* ---------- TYPES ---------- */

type PlanIcon =
    | "clock"
    | "calendar"
    | "calendarDays"
    | "calendarRange"

export interface Plan {
    id: string
    name: string
    price: number // NAIRA
    period: string
    description: string
    features: string[]
    popular?: boolean
    icon?: PlanIcon
}

interface PricingCardProps {
    plan: Plan
}

/* ---------- ICON MAP ---------- */

const iconMap: Record<PlanIcon, React.ElementType> = {
    clock: Clock,
    calendar: Calendar,
    calendarDays: CalendarDays,
    calendarRange: CalendarRange,
}

/* ---------- COMPONENT ---------- */

export function PricingCard({ plan }: PricingCardProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: "success" | "error"
        text: string
    } | null>(null)

    const { user } = useAuth()
    const router = useRouter()

    const Icon = plan.icon ? iconMap[plan.icon] : null

    async function handlePayment() {
        if (!user) {
            router.push("/login?redirect=/plans")
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const res = await fetch("/api/payments/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: plan.id,
                    planName: plan.name,
                    amount: plan.price * 100, // 👈 kobo
                }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                console.error("Payment init failed:", data)
                throw new Error(data.message || "Payment initiation failed")
            }

            // ✅ Correct message for OnePipe PWA
            setMessage({
                type: "success",
                text: "Payment initiated. Check your bank app to approve.",
            })

        } catch (err: any) {
            setMessage({
                type: "error",
                text: err.message || "Unable to initiate payment",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card
            className={cn(
                "relative flex flex-col border-border bg-card",
                plan.popular && "border-2 border-foreground"
            )}
        >
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-primary-foreground">
            Most Popular
          </span>
                </div>
            )}

            <CardHeader className="p-6 pb-0">
                {Icon && (
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-foreground" />
                    </div>
                )}

                <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                </p>

                <div className="mt-4">
          <span className="text-4xl font-bold text-foreground">
            ₦{plan.price.toLocaleString("en-NG")}
          </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-6">
                <ul className="space-y-3">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                            <span className="text-sm text-muted-foreground">
                {feature}
              </span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 p-6 pt-0">
                <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className={cn(
                        "w-full",
                        plan.popular
                            ? "bg-foreground text-primary-foreground hover:bg-foreground/90"
                            : "bg-transparent"
                    )}
                    variant={plan.popular ? "default" : "outline"}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing…
                        </>
                    ) : user ? (
                        "Pay Now"
                    ) : (
                        "Sign in to Pay"
                    )}
                </Button>

                {message && (
                    <p
                        className={cn(
                            "text-center text-sm",
                            message.type === "success"
                                ? "text-emerald-600"
                                : "text-destructive"
                        )}
                    >
                        {message.text}
                    </p>
                )}
            </CardFooter>
        </Card>
    )
}