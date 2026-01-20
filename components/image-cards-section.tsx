import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Users, Leaf } from "lucide-react"

const categories = [
  {
    title: "Strength Training",
    description: "Build muscle and increase power with our premium free weights, machines, and dedicated lifting zones.",
    image: "/images/strength-training.jpg",
    icon: Dumbbell,
  },
  {
    title: "Group Fitness Classes",
    description: "Join energizing group sessions including yoga, spinning, HIIT, and more led by certified instructors.",
    image: "/images/group-fitness.jpg",
    icon: Users,
  },
  {
    title: "Wellness & Recovery",
    description: "Rejuvenate with our spa facilities, recovery suite, massage therapy, and dedicated stretching areas.",
    image: "/images/wellness-recovery.jpg",
    icon: Leaf,
  },
]

export function ImageCardsSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive facilities designed for every aspect of your fitness journey
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.title} className="group overflow-hidden border-0 shadow-lg">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
