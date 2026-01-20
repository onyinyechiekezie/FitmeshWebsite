import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, Clock, Heart } from "lucide-react"

const features = [
  {
    icon: Dumbbell,
    title: "Premium Equipment",
    description: "Access to the latest fitness technology and equipment from industry-leading brands."
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "Certified personal trainers ready to guide you through customized workout programs."
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Open early morning to late night, 7 days a week to fit your busy schedule."
  },
  {
    icon: Heart,
    title: "Wellness Programs",
    description: "Comprehensive wellness services including nutrition counseling and recovery sessions."
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Choose FitMesh
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Everything you need to transform your fitness routine
          </p>
        </div>
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
