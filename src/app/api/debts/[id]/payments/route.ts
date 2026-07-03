import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Qarzga to'lov qo'shish
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { amount, date, note } = body;
    const debtId = params.id;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "To'lov summasini kiriting" },
        { status: 400 }
      );
    }

    // Qarzni tekshirish
    const debt = await prisma.debt.findUnique({
      where: { id: debtId },
      include: { payments: true },
    });

    if (!debt) {
      return NextResponse.json(
        { success: false, error: "Qarz topilmadi" },
        { status: 404 }
      );
    }

    const remaining = debt.totalAmount - debt.paidAmount;
    if (amount > remaining) {
      return NextResponse.json(
        { success: false, error: `Maksimal to'lov: ${remaining.toFixed(2)}` },
        { status: 400 }
      );
    }

    // To'lovni qo'shish
    const payment = await prisma.debtPayment.create({
      data: {
        debtId,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        note,
      },
    });

    // Qarz statusini yangilash
    const newPaidAmount = debt.paidAmount + parseFloat(amount);
    let newStatus: "ACTIVE" | "PARTIAL" | "PAID" = "ACTIVE";
    
    if (newPaidAmount >= debt.totalAmount) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL";
    }

    const updatedDebt = await prisma.debt.update({
      where: { id: debtId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
      include: {
        payments: {
          orderBy: { date: "desc" },
        },
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: { payment, debt: updatedDebt } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/debts/[id]/payments error:", error);
    return NextResponse.json(
      { success: false, error: "To'lov qo'shishda xatolik" },
      { status: 500 }
    );
  }
}
