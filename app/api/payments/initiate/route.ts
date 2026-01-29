// import { NextRequest, NextResponse } from "next/server"
// import { getSession } from "@/lib/auth"
// import { payments, type Payment } from "@/lib/data-store"
// import { users } from "@/lib/auth"
//
// function generatePaymentId(): string {
//   return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
// }
//
// // Calculate expiration based on plan type
// function calculateExpiration(planId: string): string {
//   const now = new Date()
//   switch (planId) {
//     case "daily":
//       now.setDate(now.getDate() + 1)
//       break
//     case "monthly":
//       now.setMonth(now.getMonth() + 1)
//       break
//     case "quarterly":
//       now.setMonth(now.getMonth() + 3)
//       break
//     case "annual":
//       now.setFullYear(now.getFullYear() + 1)
//       break
//     default:
//       now.setMonth(now.getMonth() + 1)
//   }
//   return now.toISOString()
// }
//
// // POST - Initiate a new payment
// export async function POST(request: NextRequest) {
//   try {
//     // Get authenticated user
//     const session = await getSession()
//     if (!session) {
//       return NextResponse.json(
//         { success: false, error: "Authentication required" },
//         { status: 401 }
//       )
//     }
//
//     const body = await request.json()
//     const { planId, planName, amount } = body
//
//     // Validate required fields
//     if (!planId || !planName || !amount) {
//       return NextResponse.json(
//         { success: false, error: "Missing required fields: planId, planName, amount" },
//         { status: 400 }
//       )
//     }
//
//     // Validate amount
//     if (typeof amount !== "number" || amount <= 0) {
//       return NextResponse.json(
//         { success: false, error: "Invalid amount" },
//         { status: 400 }
//       )
//     }
//
//     // Simulate payment processing (random success/failure for demo)
//     const random = Math.random()
//     let status: Payment["status"] = "successful"
//     if (random < 0.1) {
//       status = "failed"
//     } else if (random < 0.2) {
//       status = "pending"
//     }
//
//     // Create payment record
//     const payment: Payment = {
//       id: generatePaymentId(),
//       planId,
//       planName,
//       amount,
//       memberId: session.id,
//       memberName: session.name,
//       memberEmail: session.email,
//       status,
//       createdAt: new Date().toISOString()
//     }
//
//     // Store payment
//     payments.push(payment)
//
//     // If payment successful, update user's active plan
//     if (status === "successful") {
//       const userIndex = users.findIndex(u => u.id === session.id)
//       if (userIndex !== -1) {
//         users[userIndex].activePlan = planName
//         users[userIndex].planExpiresAt = calculateExpiration(planId)
//       }
//     }
//
//     return NextResponse.json({
//       success: status === "successful",
//       message: status === "successful"
//         ? "Payment processed successfully"
//         : status === "pending"
//           ? "Payment is being processed"
//           : "Payment failed",
//       paymentId: payment.id,
//       status,
//       payment
//     })
//   } catch (error) {
//     console.error("Error processing payment:", error)
//     return NextResponse.json(
//       { success: false, error: "Failed to process payment" },
//       { status: 500 }
//     )
//   }
// }



// import { prisma } from "@/lib/db";
// import { pwaRequest } from "@/lib/onepipe";
// import { NextResponse } from "next/server";
//
// export async function POST(req: Request) {
//     try {
//         const body = await req.json();
//         const { userId, amount, type, planId } = body;
//
//         const reference = `FITMESH_${Date.now()}`;
//
//         const payment = await prisma.payment.create({
//             data: {
//                 userId,
//                 amount,
//                 type,
//                 planId,
//                 reference,
//                 status: "PENDING",
//             },
//         });
//
//         const onepipeResponse = await pwaRequest({
//             amount,
//             reference,
//             currency: "NGN",
//             customer_id: userId,
//         });
//
//         return NextResponse.json({
//             paymentId: payment.id,
//             reference,
//             onepipe: onepipeResponse,
//         });
//
//     } catch (error: any) {
//         console.error("Payment initiation error:", error.message);
//
//         return NextResponse.json(
//             { error: error.message },
//             { status: 400 }
//         );
//     }
// }


// import { NextResponse } from "next/server";
// import { pwaRequest } from "@/lib/onepipe";
// import { getSession } from "@/lib/auth";
//
// export async function POST(req: Request) {
//     const session = await getSession();
//
//     if (!session) {
//         return NextResponse.json(
//             { message: "Unauthorized" },
//             { status: 401 }
//         );
//     }
//
//     const body = await req.json();
//
//     const reference = `FITMESH-${Date.now()}`;
//
//     const payload = {
//         reference,
//         amount: body.amount,
//         currency: "NGN",
//         narration: "FitMesh Subscription",
//         customer: {
//             email: session.email,
//             name: session.name,
//         },
//         billerCode: process.env.ONEPIPE_BILLER_CODE,
//     };
//
//     try {
//         const response = await pwaRequest(payload);
//
//         return NextResponse.json({
//             success: true,
//             reference,
//             response,
//         });
//     } catch (err: any) {
//         return NextResponse.json(
//             { success: false, message: err.message },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import { pwaRequest } from "@/lib/onepipe";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const requestRef = `REQ-${Date.now()}`;
    const transactionRef = `TX-${Date.now()}`;

    const payload = {
        request_ref: requestRef,
        request_type: "send invoice",

        auth: {
            type: null,
            secure: null,
            auth_provider: "PaywithAccount",
        },

        transaction: {
            mock_mode: "Inspect", // 👈 CHANGE TO "Live" LATER
            transaction_ref: transactionRef,
            transaction_desc: "FitMesh Subscription Payment",
            transaction_ref_parent: null,

            amount: body.amount,

            customer: {
                customer_ref: session.id,
                firstname: session.name?.split(" ")[0] ?? "User",
                surname: session.name?.split(" ")[1] ?? "FitMesh",
                email: session.email,
                mobile_no: "08000000000", // mock-safe number
            },

            meta: {
                type: "single_payment",
                expires_in: 30,
                skip_messaging: false,
                biller_code: process.env.ONEPIPE_BILLER_CODE,
            },

            details: {},
        },
    };

    try {
        const response = await pwaRequest(payload);

        return NextResponse.json({
            success: true,
            requestRef,
            transactionRef,
            response,
        });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
