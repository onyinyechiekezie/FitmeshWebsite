import crypto from "crypto"

export function generateSignature(
    requestRef: string,
    clientSecret: string
) {
    const raw = `${requestRef.trim()};${clientSecret.trim()}`
    return crypto.createHash("md5").update(raw).digest("hex")
}
