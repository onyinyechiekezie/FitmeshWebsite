// import { Navigation } from "@/components/navigation"
// import { Footer } from "@/components/footer"
// import { PricingCard } from "@/components/pricing-card"
// import { Clock, Calendar, CalendarDays, CalendarRange } from "lucide-react"
//
// const plans = [
//   {
//     id: "daily",
//     name: "Daily Pass",
//     price: 15,
//     period: "day",
//     description: "Perfect for trying out our facilities",
//     icon: Clock,
//     features: [
//       "Full gym access for 24 hours",
//       "All equipment usage",
//       "Locker room access",
//       "1 group class included",
//       "No commitment required"
//     ]
//   },
//   {
//     id: "monthly",
//     name: "Monthly Membership",
//     price: 49,
//     period: "month",
//     description: "Great for regular gym-goers",
//     icon: Calendar,
//     features: [
//       "Unlimited gym access",
//       "All equipment usage",
//       "Locker room access",
//       "Unlimited group classes",
//       "Mobile app access",
//       "Fitness assessment"
//     ],
//     popular: true
//   },
//   {
//     id: "quarterly",
//     name: "Quarterly Membership",
//     price: 129,
//     period: "3 months",
//     description: "Save more with a 3-month commitment",
//     icon: CalendarDays,
//     features: [
//       "Everything in Monthly",
//       "10% savings vs monthly",
//       "1 personal training session",
//       "Nutrition consultation",
//       "Guest passes (2/month)",
//       "Sauna & steam room"
//     ]
//   },
//   {
//     id: "annual",
//     name: "Annual Membership",
//     price: 449,
//     period: "year",
//     description: "Best value for committed members",
//     icon: CalendarRange,
//     features: [
//       "Everything in Quarterly",
//       "25% savings vs monthly",
//       "4 personal training sessions",
//       "Priority class booking",
//       "Private locker",
//       "Exclusive member events"
//     ]
//   }
// ]
//
// export default function PlansPage() {
//   return (
//     <div className="min-h-screen">
//       <Navigation />
//       <main className="py-16 sm:py-20">
//         <div className="mx-auto max-w-6xl px-4 sm:px-6">
//           <div className="text-center">
//             <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
//               Membership Plans
//             </h1>
//             <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
//               Choose the plan that fits your lifestyle. All plans include access to our premium facilities.
//             </p>
//           </div>
//
//           <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//             {plans.map((plan) => (
//               <PricingCard key={plan.id} plan={plan} />
//             ))}
//           </div>
//
//           <div className="mt-16 rounded-xl border border-border bg-card p-8 text-center">
//             <h2 className="text-xl font-semibold text-foreground">Need a custom solution?</h2>
//             <p className="mt-2 text-muted-foreground">
//               Contact us for corporate memberships or special requirements.
//             </p>
//             <p className="mt-4 text-sm font-medium text-foreground">
//               corporate@fitmesh.com
//             </p>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }



// const plans = [
//   {
//     id: "daily",
//     name: "Daily Pass",
//     price: 15,
//     period: "day",
//     description: "Perfect for trying out our facilities",
//     icon: "clock",
//     features: [
//       "Full gym access for 24 hours",
//       "All equipment usage",
//       "Locker room access",
//       "1 group class included",
//       "No commitment required"
//     ]
//   },
//   {
//     id: "monthly",
//     name: "Monthly Membership",
//     price: 49,
//     period: "month",
//     description: "Great for regular gym-goers",
//     icon: "calendar",
//     features: [
//       "Unlimited gym access",
//       "All equipment usage",
//       "Locker room access",
//       "Unlimited group classes",
//       "Mobile app access",
//       "Fitness assessment"
//     ],
//     popular: true
//   },
//   {
//     id: "quarterly",
//     name: "Quarterly Membership",
//     price: 129,
//     period: "3 months",
//     description: "Save more with a 3-month commitment",
//     icon: "calendarDays",
//     features: [
//       "Everything in Monthly",
//       "10% savings vs monthly",
//       "1 personal training session",
//       "Nutrition consultation",
//       "Guest passes (2/month)",
//       "Sauna & steam room"
//     ]
//   },
//   {
//     id: "annual",
//     name: "Annual Membership",
//     price: 449,
//     period: "year",
//     description: "Best value for committed members",
//     icon: "calendarRange",
//     features: [
//       "Everything in Quarterly",
//       "25% savings vs monthly",
//       "4 personal training sessions",
//       "Priority class booking",
//       "Private locker",
//       "Exclusive member events"
//     ]
//   }
// ]





import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PricingCard, type Plan } from "@/components/pricing-card"

const plans: Plan[] = [
  {
    id: "daily",
    name: "Daily Pass",
    price: 1,
    period: "day",
    description: "Perfect for trying out our facilities",
    icon: "clock",
    features: [
      "Full gym access for 24 hours",
      "All equipment usage",
      "Locker room access",
      "1 group class included",
      "No commitment required",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Membership",
    price: 2,
    period: "month",
    description: "Great for regular gym-goers",
    icon: "calendar",
    popular: true,
    features: [
      "Unlimited gym access",
      "All equipment usage",
      "Locker room access",
      "Unlimited group classes",
      "Mobile app access",
      "Fitness assessment",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Membership",
    price: 3,
    period: "3 months",
    description: "Save more with a 3-month commitment",
    icon: "calendarDays",
    features: [
      "Everything in Monthly",
      "10% savings vs monthly",
      "1 personal training session",
      "Nutrition consultation",
      "Guest passes (2/month)",
      "Sauna & steam room",
    ],
  },
  {
    id: "annual",
    name: "Annual Membership",
    price: 4,
    period: "year",
    description: "Best value for committed members",
    icon: "calendarRange",
    features: [
      "Everything in Quarterly",
      "25% savings vs monthly",
      "4 personal training sessions",
      "Priority class booking",
      "Private locker",
      "Exclusive member events",
    ],
  },
]

export default function PlansPage() {
  return (
      <div className="min-h-screen">
        <Navigation />

        <main className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Membership Plans
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that fits your lifestyle.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                  <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
  )
}
