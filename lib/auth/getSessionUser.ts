import { cookies } from "next/headers"

export async function getSessionUser() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/session`, {
        headers: {
            Cookie: cookies().toString(),
        },
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.authenticated ? data.user : null
}