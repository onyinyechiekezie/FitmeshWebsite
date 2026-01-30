// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";
//
// export async function GET(req: Request) {
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
//
//     if (!userId) {
//         return NextResponse.json({ error: "User required" }, { status: 400 });
//     }
//
//     const payments = await prisma.payment.findMany({
//         where: { userId },
//         orderBy: { createdAt: "desc" },
//     });
//
//     return NextResponse.json(payments);
// }
