import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Barcha qarzlarni olish
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = status && status !== "all" 
      ? { status: status.toUpperCase() as "ACTIVE" | "PARTIAL" | "PAID" }
      : {};

    const debts = await prisma.debt.findMany({
      where,
      include: {
        payments: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: debts });
  } catch (error) {
    console.error("GET /api/debts error:", error);
    return NextResponse.json(
      { success: false, error: "Qarzlarni olishda xatolik" },
      { status: 500 }
    );
  }
}

// POST - Yangi qarz qo'shish
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creditorName, creditorType, phone, description, totalAmount, dueDate } = body;

    console.log("Received debt data:", { creditorName, creditorType, phone, totalAmount, dueDate });

    if (!creditorName || !creditorName.trim()) {
      return NextResponse.json(
        { success: false, error: "Kreditor nomini kiriting" },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Qarz summasini to'g'ri kiriting" },
        { status: 400 }
      );
    }

    const debt = await prisma.debt.create({
      data: {
        creditorName: creditorName.trim(),
        creditorType: (creditorType?.toUpperCase() || "COMPANY") as "COMPANY" | "PERSON",
        phone: phone?.trim() || null,
        description: description?.trim() || null,
        totalAmount: parseFloat(totalAmount),
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "ACTIVE",
        paidAmount: 0,
      },
      include: {
        payments: true,
      },
    });

    console.log("Debt created successfully:", debt.id);

    return NextResponse.json({ success: true, data: debt }, { status: 201 });
  } catch (error) {
    console.error("POST /api/debts error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Qarz qo'shishda xatolik", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
