// import axios from "axios"
//
// export const onepipe = axios.create({
//     baseURL: process.env.ONEPIPE_BASE_URL,
//     headers: {
//         "Authorization": `Bearer ${process.env.ONEPIPE_API_KEY}`,
//         "Content-Type": "application/json",
//     },
// })


import crypto from "crypto";

export async function pwaRequest(
    payload: any
) {
    const reference = payload.reference;

    const signature = crypto
        .createHash("md5")
        .update(reference + process.env.ONEPIPE_SECRET_KEY)
        .digest("hex");

    const res = await fetch(process.env.PWA_API_URL!, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.ONEPIPE_API_KEY}`,
            "X-ONEPIPE-SIGNATURE": signature,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.status === "error") {
        throw new Error(data.message || "PWA request failed");
    }

    return data;
}
