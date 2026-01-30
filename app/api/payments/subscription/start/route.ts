import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth/getSessionUser"
import { generateSignature } from "@/lib/onepipe/signature"
import { OnePipeInvoiceRequest } from "@/lib/onepipe/types"
import crypto from "crypto"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { amount, planName, frequency, customer } = body as {
            amount: number
            planName: string
            frequency: string
            customer?: {
                email?: string
                mobile_no?: string
                firstname?: string
                surname?: string
            }
        }

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { success: false, message: "Invalid amount" },
                { status: 400 }
            )
        }

        const allowedFrequencies = ["weekly", "monthly", "quarterly", "yearly"] as const
        let freq = typeof frequency === "string" ? frequency.toLowerCase() : ""
        // OnePipe may expect 'annual' instead of 'yearly'
        if (freq === "yearly") freq = "annual"
        if (!["weekly", "monthly", "quarterly", "annual"].includes(freq)) {
            return NextResponse.json(
                { success: false, message: "Invalid frequency. Use one of: weekly, monthly, quarterly, annual." },
                { status: 400 }
            )
        }

        const requestRef = crypto.randomUUID()
        const transactionRef = `GYM-${Date.now()}`

        const sessionUser = await getSessionUser().catch(() => null)
        const email = customer?.email ?? sessionUser?.email ?? "member@gym.com"
        const firstname = customer?.firstname ?? sessionUser?.firstName ?? "Gym"
        const surname = customer?.surname ?? sessionUser?.lastName ?? "Member"
        const rawMobile = customer?.mobile_no ?? sessionUser?.mobile_no ?? "07034475242"

        function normalizeMobile(msisdn: string) {
            const x = (msisdn || "").trim()
            if (x.startsWith("+")) return x
            if (x.startsWith("0")) return "+234" + x.slice(1)
            if (x.startsWith("234")) return "+" + x
            return x
        }
        const mobile_no = normalizeMobile(rawMobile)

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
                transaction_desc: `Gym subscription - ${planName}`,
                transaction_ref_parent: null,
                amount: Math.round(amount * 100),
                customer: {
                    customer_ref: mobile_no,
                    firstname,
                    surname,
                    email,
                    mobile_no,
                },
                meta: {
                    type: "subscription",
                    expires_in: 30,
                    skip_messaging: false,
                    biller_code: process.env.ONEPIPE_BILLER_CODE!,
                },
                details: {
                    plan_name: planName,
                    frequency: freq, // weekly | monthly | quarterly | annual
                    start_date: new Date().toISOString().slice(0, 10),
                },
            },
        }

        const {
            ONEPIPE_API_KEY,
            ONEPIPE_CLIENT_SECRET,
            ONEPIPE_SECRET_KEY,
            ONEPIPE_CLIENT_KEY,
            ONEPIPE_BASE_URL,
            PWA_API_URL,
        } = process.env

        const clientSecret = ONEPIPE_CLIENT_SECRET ?? ONEPIPE_SECRET_KEY ?? ONEPIPE_CLIENT_KEY
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
        console.error("START SUBSCRIPTION ERROR:", err)
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        )
    }
}