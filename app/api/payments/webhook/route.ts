// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";
//
// export async function POST(req: Request) {
//     const payload = await req.json();
//
//     const { reference, status } = payload;
//
//     await prisma.payment.update({
//         where: { reference },
//         data: {
//             status: status === "SUCCESS" ? "SUCCESS" : "FAILED",
//         },
//     });
//
//     return NextResponse.json({ received: true });
// }
