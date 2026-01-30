import crypto from "crypto"

export function generateSignature(
    requestRef: string,
    clientSecret: string
) {
    if (typeof requestRef !== "string" || typeof clientSecret !== "string") {
        throw new Error("Invalid signature inputs: requestRef or clientSecret missing")
    }
    const raw = `${requestRef.trim()};${clientSecret.trim()}`
    return crypto.createHash("md5").update(raw).digest("hex")
}
