import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

export type UserRole = "member" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string
  createdAt: string
  activePlan?: string
  planExpiresAt?: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: UserRole
}

// In-memory user storage - in production, use a database
export const users: User[] = [
  {
    id: "admin_1",
    email: "admin@fitmesh.com",
    name: "Admin User",
    role: "admin",
    // Password: admin123 (hashed with simple hash for demo)
    passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
    createdAt: new Date().toISOString()
  }
]

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "fitmesh-secret-key-change-in-production"
)

// Simple hash function for demo - in production use bcrypt
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ 
    id: user.id, 
    email: user.email, 
    name: user.name, 
    role: user.role 
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY)
  
  return token
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole
    }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  
  if (!token) {
    return null
  }
  
  return verifySession(token)
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireRole(role: UserRole): Promise<SessionUser> {
  const session = await requireAuth()
  if (session.role !== role) {
    throw new Error("Forbidden")
  }
  return session
}

export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
