// import { NextResponse } from "next/server";
// import crypto from "crypto";
//
// export async function POST(req: Request) {
//     const body = await req.text();
//     const signature = req.headers.get("signature");
//
//     const expected = crypto
//         .createHash("md5")
//         .update(body + process.env.ONEPIPE_CLIENT_SECRET!)
//         .digest("hex");
//
//     if (signature !== expected) {
//         return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
//     }
//
//     const payload = JSON.parse(body);
//
//     console.log("✅ ONEPIPE WEBHOOK:", payload);
//
//     // update DB here
//
//     return NextResponse.json({ received: true });
// }


import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const payload = await req.json()

    const txRef = payload?.details?.transaction_ref
    const status = payload?.details?.status

    console.log("ONEPIPE WEBHOOK:", txRef, status)

    if (!txRef) {
        return NextResponse.json({ ok: false })
    }

    if (status === "Successful") {
        // update payment → SUCCESSFUL
    } else if (status === "Failed") {
        // update payment → FAILED
    }

    return NextResponse.json({ ok: true })
}