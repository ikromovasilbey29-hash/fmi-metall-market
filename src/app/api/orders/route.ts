import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, address, paymentType, items, totalPrice } = body;

    if (!fullName || !phone || !address || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Barcha majburiy maydonlar to'ldirilishi shart" },
        { status: 400 }
      );
    }

    // TODO: DB bilan:
    // const order = await prisma.order.create({
    //   data: {
    //     userId: session.user.id,
    //     fullName, phone, email: email || "", address,
    //     paymentType: paymentType || "CASH",
    //     totalPrice,
    //     status: "NEW",
    //     items: { create: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
    //   },
    // });

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase();
    void email; void paymentType; void totalPrice;

    return NextResponse.json({
      success: true,
      message: "Buyurtma muvaffaqiyatli qabul qilindi",
      data: { id: orderId },
    });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json(
      { success: false, error: "Server xatosi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // TODO: prisma.order.findMany() bilan almashtiring
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
  }
}
