

// import { NextResponse } from "next/server";
// import { sendInvoice } from "@/lib/onepipe";
// import { getSession } from "@/lib/auth";
//
// export async function POST(req: Request) {
//     try {
//         const session = await getSession();
//         if (!session) {
//             return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         }
//
//         const { amount } = await req.json();
//
//         const requestRef = `FITMESH-${Date.now()}`;
//         const transactionRef = `TXN-${Date.now()}`;
//
//         const payload = {
//             request_ref: requestRef,
//             request_type: "send invoice",
//             auth: {
//                 type: null,
//                 secure: null,
//                 auth_provider: "PaywithAccount",
//             },
//             transaction: {
//                 mock_mode: "Live", // change to Inspect for testing
//                 transaction_ref: transactionRef,
//                 transaction_desc: "FitMesh Subscription",
//                 amount: amount, // already in NAIRA
//                 customer: {
//                     customer_ref: session.email,
//                     firstname: session.name?.split(" ")[0] || "User",
//                     surname: session.name?.split(" ")[1] || "User",
//                     email: session.email,
//                     mobile_no: "08000000000", // REQUIRED
//                 },
//                 meta: {
//                     type: "single_payment",
//                     expires_in: 30,
//                     skip_messaging: false,
//                     biller_code: process.env.ONEPIPE_BILLER_CODE,
//                 },
//                 details: {},
//             },
//         };
//
//         const response = await sendInvoice(payload);
//
//         return NextResponse.json({
//             success: true,
//             reference: requestRef,
//             data: response.data,
//         });
//
//     } catch (err: any) {
//         console.error("🔥 PAYMENT INIT ERROR:", err);
//         return NextResponse.json(
//             { success: false, message: err.message },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server"
import { generateSignature } from "@/lib/onepipe/signature"
import { OnePipeInvoiceRequest } from "@/lib/onepipe/types"
import crypto from "crypto"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { amount, planName } = body

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid amount" },
                { status: 400 }
            )
        }

        const requestRef = crypto.randomUUID()
        const transactionRef = `GYM-${Date.now()}`

        const payload: OnePipeInvoiceRequest = {
            request_ref: requestRef,
            request_type: "send invoice",
            auth: {
                type: null,
                secure: null,
                auth_provider: "PaywithAccount",
            },
            transaction: {
                mock_mode: "Live",
                transaction_ref: transactionRef,
                transaction_desc: `Gym membership - ${planName}`,
                transaction_ref_parent: null,
                amount: amount * 100, // already in kobo
                customer: {
                    customer_ref: "+2347034475242",
                    firstname: "Gym",
                    surname: "Member",
                    email: "member@gym.com",
                    mobile_no: "07034475242",
                },
                meta: {
                    type: "single_payment",
                    expires_in: 30,
                    skip_messaging: false,
                    biller_code: process.env.ONEPIPE_BILLER_CODE!,
                },
                details: {},
            },
        }

        const {
            ONEPIPE_API_KEY,
            ONEPIPE_CLIENT_SECRET,
            ONEPIPE_SECRET_KEY,
            ONEPIPE_BASE_URL,
            PWA_API_URL,
        } = process.env

        const clientSecret = ONEPIPE_CLIENT_SECRET ?? ONEPIPE_SECRET_KEY
        const endpointUrl = PWA_API_URL ?? (ONEPIPE_BASE_URL ? `${ONEPIPE_BASE_URL}/v2/transact` : undefined)

        if (!ONEPIPE_API_KEY || !clientSecret || !endpointUrl) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Missing OnePipe configuration. Set ONEPIPE_API_KEY, ONEPIPE_CLIENT_SECRET or ONEPIPE_SECRET_KEY, and PWA_API_URL or ONEPIPE_BASE_URL.",
                },
                { status: 500 }
            )
        }

        const signature = generateSignature(requestRef, clientSecret)

        const res = await fetch(
            endpointUrl,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ONEPIPE_API_KEY}`,
                    Signature: signature,
                },
                body: JSON.stringify(payload),
            }
        )

        const response = await res.json()

        console.log("ONEPIPE RAW:", response)

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: response?.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            transactionRef,
            response,
        })
    } catch (err: any) {
        console.error("INITIATE PAYMENT ERROR:", err)
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        )
    }
}



// import { NextResponse } from "next/server"
// import { generateSignature } from "@/lib/onepipe/signature"
// import { OnePipeInvoiceRequest } from "@/lib/onepipe/types"
// import crypto from "crypto"
// import pool  from "@/lib/db"
// import { v4 as uuidv4 } from "uuid"
//
//
//
// export async function POST(req: Request) {
//
//     try {
//         const body = await req.json()
//         console.log("PAYMENT INIT BODY:", body)
//         // const body = await req.json()
//         const { amount, planName, userId } = body
//
//         if (!amount || amount <= 0 || !userId) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid request" },
//                 { status: 400 }
//             )
//         }
//
//         const requestRef = crypto.randomUUID()
//         const transactionRef = `GYM-${Date.now()}`
//
//         /** ✅ 1. SAVE PAYMENT AS PENDING */
//         await pool.query(
//             `
//       INSERT INTO payments (
//         id,
//         user_id,
//         amount,
//         status,
//         type,
//         reference,
//         plan_name
//       )
//       VALUES ($1,$2,$3,$4,$5,$6,$7)
//       `,
//             [
//                 uuidv4(),
//                 userId,
//                 amount, // store in naira, not kobo
//                 "PENDING",
//                 "SINGLE",
//                 transactionRef,
//                 planName,
//             ]
//         )
//
//         /**2. BUILD ONEPIPE PAYLOAD (UNCHANGED LOGIC) */
//         const payload: OnePipeInvoiceRequest = {
//             request_ref: requestRef,
//             request_type: "send invoice",
//             auth: {
//                 type: null,
//                 secure: null,
//                 auth_provider: "PaywithAccount",
//             },
//             transaction: {
//                 mock_mode: "Live",
//                 transaction_ref: transactionRef,
//                 transaction_desc: `Gym membership - ${planName}`,
//                 transaction_ref_parent: null,
//                 amount: amount * 100, // OnePipe expects kobo
//                 customer: {
//                     customer_ref: "2349038275442",
//                     firstname: "Gym",
//                     surname: "Member",
//                     email: "member@gym.com",
//                     mobile_no: "09038275442",
//                 },
//                 meta: {
//                     type: "single_payment",
//                     expires_in: 30,
//                     skip_messaging: false,
//                     biller_code: process.env.ONEPIPE_BILLER_CODE!,
//                 },
//                 details: {},
//             },
//         }
//
//         const signature = generateSignature(
//             requestRef,
//             process.env.ONEPIPE_CLIENT_SECRET!
//         )
//
//         /** ✅ 3. CALL ONEPIPE */
//         const res = await fetch(
//             `${process.env.ONEPIPE_BASE_URL}/v2/transact`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${process.env.ONEPIPE_API_KEY}`,
//                     Signature: signature,
//                 },
//                 body: JSON.stringify(payload),
//             }
//         )
//
//         const response = await res.json()
//         console.log("ONEPIPE RAW:", response)
//
//         if (!res.ok) {
//             return NextResponse.json(
//                 { success: false, message: response?.message || "OnePipe error" },
//                 { status: 400 }
//             )
//         }
//
//         return NextResponse.json({
//             success: true,
//             transactionRef,
//             response
//         })
//     } catch (err: any) {
//         console.error("INITIATE PAYMENT ERROR:", err)
//         return NextResponse.json(
//             { success: false, message: "Server error" },
//             { status: 500 }
//         )
//     }
// }



