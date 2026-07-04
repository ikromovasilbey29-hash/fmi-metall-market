import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface OrderItemInput {
  productId: string;
  name?: string;
  productName?: string;
  quantity: number;
  price: number;
  unit?: string;
}

// POST - Yangi buyurtma yaratish
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, address, paymentType, items, totalPrice, userEmail } = body;

    if (!fullName || !phone || !address || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Barcha majburiy maydonlar to'ldirilishi shart" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userEmail: userEmail || email || "guest",
        fullName,
        phone,
        email: email || "",
        address,
        paymentType: (paymentType || "CASH") as "CASH" | "CARD" | "BANK_TRANSFER",
        totalPrice: Number(totalPrice) || 0,
        status: "NEW",
        items: {
          create: (items as OrderItemInput[]).map((i) => ({
            productId: i.productId,
            productName: i.name || i.productName || "",
            unit: i.unit || "kg",
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: "Buyurtma muvaffaqiyatli qabul qilindi",
      data: order,
    });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { success: false, error: "Server xatosi" },
      { status: 500 }
    );
  }
}

// GET - Buyurtmalarni olish (admin uchun barchasi, mijoz uchun ?email= bilan filtrlangan)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const orders = await prisma.order.findMany({
      where: email ? { userEmail: email } : {},
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
  }
}
