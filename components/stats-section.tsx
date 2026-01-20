const stats = [
  { value: "10K+", label: "Active Members" },
  { value: "50+", label: "Expert Trainers" },
  { value: "24/7", label: "Open Hours" },
  { value: "15+", label: "Years Experience" }
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
