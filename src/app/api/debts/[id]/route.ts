import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Bitta qarzni olish
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const debt = await prisma.debt.findUnique({
      where: { id: params.id },
      include: {
        payments: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!debt) {
      return NextResponse.json(
        { success: false, error: "Qarz topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: debt });
  } catch (error) {
    console.error("GET /api/debts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Qarzni olishda xatolik" },
      { status: 500 }
    );
  }
}

// PATCH - Qarzni yangilash
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { creditorName, creditorType, phone, description, totalAmount, dueDate } = body;

    const debt = await prisma.debt.update({
      where: { id: params.id },
      data: {
        ...(creditorName && { creditorName }),
        ...(creditorType && { creditorType: creditorType.toUpperCase() }),
        ...(phone !== undefined && { phone }),
        ...(description !== undefined && { description }),
        ...(totalAmount && { totalAmount: parseFloat(totalAmount) }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: {
        payments: true,
      },
    });

    return NextResponse.json({ success: true, data: debt });
  } catch (error) {
    console.error("PATCH /api/debts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Qarzni yangilashda xatolik" },
      { status: 500 }
    );
  }
}

// DELETE - Qarzni o'chirish
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.debt.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Qarz o'chirildi" });
  } catch (error) {
    console.error("DELETE /api/debts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Qarzni o'chirishda xatolik" },
      { status: 500 }
    );
  }
}
