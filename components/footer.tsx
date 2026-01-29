import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">FitMesh</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium fitness facility dedicated to your health and wellness journey.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-muted-foreground">123 Fitness Avenue</li>
              <li className="text-sm text-muted-foreground">Lagos Nigeria, Ago 10001</li>
              <li className="text-sm text-muted-foreground">info@fitmesh.com</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-foreground">Hours</h4>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-muted-foreground">Mon - Fri: 5am - 11pm</li>
              <li className="text-sm text-muted-foreground">Sat - Sun: 6am - 10pm</li>
              <li className="text-sm text-muted-foreground">Holidays: 8am - 6pm</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            2026 FitMesh Gym & Wellness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
