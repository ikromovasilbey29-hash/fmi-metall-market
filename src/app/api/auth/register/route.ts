import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma"; // DB tayyor bo'lgach uncomment qiling

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, password } = body;

    // Validation
    if (!firstName || !lastName || !phone || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Barcha maydonlar to'ldirilishi shart" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // TODO: DB bilan ishlashda quyidagini uncomment qiling:
    // const existingUser = await prisma.user.findFirst({
    //   where: { OR: [{ email }, { phone }] },
    // });
    // if (existingUser) {
    //   return NextResponse.json({ success: false, error: "Bu email yoki telefon allaqachon ro'yxatdan o'tgan" }, { status: 409 });
    // }
    // const user = await prisma.user.create({
    //   data: { firstName, lastName, phone, email, passwordHash, role: "USER" },
    // });

    // Demo mode
    const user = { id: "demo-" + Date.now(), firstName, lastName, email, phone, role: "USER" };
    void passwordHash;

    return NextResponse.json({
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz",
      data: { id: user.id, firstName: user.firstName, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Server xatosi" },
      { status: 500 }
    );
  }
}
