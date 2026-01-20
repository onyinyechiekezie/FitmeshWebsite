import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl bg-foreground p-8 text-center sm:p-12 lg:p-16">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-primary-foreground/80">
            Join thousands of members who have transformed their lives with FitMesh. Your first week is on us.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
              <Link href="/plans">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
