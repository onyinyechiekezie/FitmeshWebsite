import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image
        src="/images/hero-gym.jpg"
        alt="Modern gym interior with state-of-the-art equipment"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      <div className="relative flex min-h-[85vh] items-center">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Now Open 24/7
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              FitMesh Gym & Wellness
            </h1>
            <p className="mt-4 text-xl font-medium text-white/90 sm:text-2xl">
              Stronger Every Day
            </p>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
              State-of-the-art equipment, expert trainers, and a community dedicated to helping you achieve your health and wellness goals.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full bg-white text-black hover:bg-white/90 sm:w-auto">
                <Link href="/plans">
                  View Membership Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                <Link href="/login">Member Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
