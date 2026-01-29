// import axios from "axios"
//
// export const onepipe = axios.create({
//     baseURL: process.env.ONEPIPE_BASE_URL,
//     headers: {
//         "Authorization": `Bearer ${process.env.ONEPIPE_API_KEY}`,
//         "Content-Type": "application/json",
//     },
// })


// import crypto from "crypto";
//
// export async function pwaRequest(
//     payload: any
// ) {
//     const reference = payload.reference;
//
//     const signature = crypto
//         .createHash("md5")
//         .update(reference + process.env.ONEPIPE_SECRET_KEY)
//         .digest("hex");
//
//     const res = await fetch(process.env.PWA_API_URL!, {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${process.env.ONEPIPE_API_KEY}`,
//             "X-ONEPIPE-SIGNATURE": signature,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//     });
//
//     const data = await res.json();
//
//     if (!res.ok || data.status === "error") {
//         throw new Error(data.message || "PWA request failed");
//     }
//
//     return data;
// }

// import crypto from "crypto";
//
// export async function pwaRequest(payload: any) {
//     const reference = payload.reference;
//
//     if (!reference) {
//         throw new Error("Payment reference is required");
//     }
//
//     const rawSignature = `${reference};${process.env.ONEPIPE_SECRET_KEY}`;
//
//     const signature = crypto
//         .createHash("md5")
//         .update(rawSignature)
//         .digest("hex");
//
//     const res = await fetch(process.env.PWA_API_BASE_URL!, {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${process.env.ONEPIPE_API_KEY}`,
//             "X-ONEPIPE-SIGNATURE": signature,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//     });
//
//     const data = await res.json();
//
//     if (!res.ok) {
//         console.error("OnePipe error:", data);
//         throw new Error(data?.message || "OnePipe request failed");
//     }
//
//     return data;
// }

import crypto from "crypto";

const ONEPIPE_BASE_URL = process.env.ONEPIPE_BASE_URL!;
const ONEPIPE_API_KEY = process.env.ONEPIPE_API_KEY!;
const ONEPIPE_CLIENT_SECRET = process.env.ONEPIPE_CLIENT_SECRET!;

function generateSignature(requestRef: string) {
    return crypto
        .createHash("md5")
        .update(`${requestRef};${ONEPIPE_CLIENT_SECRET}`)
        .digest("hex");
}

export async function sendInvoice(payload: any) {
    const requestRef = payload.request_ref;
    const signature = generateSignature(requestRef);

    console.log("➡️ ONEPIPE REQUEST:", JSON.stringify(payload, null, 2));

    const res = await fetch(`${ONEPIPE_BASE_URL}/transact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ONEPIPE_API_KEY}`,
            Signature: signature,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("⬅️ ONEPIPE RESPONSE:", JSON.stringify(data, null, 2));

    if (!res.ok) {
        throw new Error(data?.message || "OnePipe request failed");
    }

    if (
        data.status !== "Successful" &&
        data.status !== "Processing"
    ) {
        throw new Error(data.message || "Transaction failed");
    }

    return data;
}
