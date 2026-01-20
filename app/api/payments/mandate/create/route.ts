import { prisma } from "@/lib/db";
import { onePipeRequest } from "@/lib/onepipe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await req.json();

    const mandateRef = `MANDATE_${Date.now()}`;

    // Save mandate locally
    await prisma.mandate.create({
        data: {
            userId,
            mandateRef,
            status: "PENDING",
        },
    });

    // Call OnePipe
    const response = await onePipeRequest(
        "/mandates/create",
        {
            customer_id: userId,
            mandate_reference: mandateRef,
        }
    );

    return NextResponse.json({
        mandateRef,
        onepipe: response,
    });
}
