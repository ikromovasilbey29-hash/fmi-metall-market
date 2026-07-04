import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Bitta buyurtmani olish
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Buyurtma topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
  }
}

// PATCH - Buyurtma holatini o'zgartirish
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["NEW", "PROCESSING", "DELIVERING", "DELIVERED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Holat noto'g'ri" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ success: false, error: "Buyurtma holatini yangilashda xatolik" }, { status: 500 });
  }
}
