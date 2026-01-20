// import { NextRequest, NextResponse } from "next/server"
// import { jwtVerify } from "jose"
//
// const SECRET_KEY = new TextEncoder().encode(
//   process.env.JWT_SECRET || "fitmesh-secret-key-change-in-production"
// )
//
// async function verifyToken(token: string) {
//   try {
//     const { payload } = await jwtVerify(token, SECRET_KEY)
//     return payload
//   } catch {
//     return null
//   }
// }
//
// // Routes that require authentication
// const protectedRoutes = ["/dashboard"]
// // Routes that require admin role
// const adminRoutes = ["/admin"]
// // Routes that should redirect to dashboard if already logged in
// const authRoutes = ["/login", "/register"]
//
// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const token = request.cookies.get("session")?.value
//
//   // Verify token if present
//   const session = token ? await verifyToken(token) : null
//
//   // Check if trying to access auth routes while logged in
//   if (authRoutes.some(route => pathname.startsWith(route))) {
//     if (session) {
//       return NextResponse.redirect(new URL("/dashboard", request.url))
//     }
//     return NextResponse.next()
//   }
//
//   // Check if trying to access admin routes
//   if (adminRoutes.some(route => pathname.startsWith(route))) {
//     if (!session) {
//       const loginUrl = new URL("/login", request.url)
//       loginUrl.searchParams.set("redirect", pathname)
//       return NextResponse.redirect(loginUrl)
//     }
//     if (session.role !== "admin") {
//       return NextResponse.redirect(new URL("/dashboard", request.url))
//     }
//     return NextResponse.next()
//   }
//
//   // Check if trying to access protected routes
//   if (protectedRoutes.some(route => pathname.startsWith(route))) {
//     if (!session) {
//       const loginUrl = new URL("/login", request.url)
//       loginUrl.searchParams.set("redirect", pathname)
//       return NextResponse.redirect(loginUrl)
//     }
//     return NextResponse.next()
//   }
//
//   return NextResponse.next()
// }
//
// export const config = {
//   matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"]
// }

import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || "fitmesh-secret-key-change-in-production"
)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch {
    return null
  }
}

// Routes that require authentication
const protectedRoutes = ["/dashboard"]
// Routes that require admin role
const adminRoutes = ["/admin"]
// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("session")?.value

  const session = token ? await verifyToken(token) : null

  // If logged-in user tries to access login/register
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Admin-only routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  }

  // Protected user routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"]
}
