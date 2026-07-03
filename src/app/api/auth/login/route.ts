import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Telefon/email va parol kiritilishi shart" },
        { status: 400 }
      );
    }

    // TODO: DB bilan ishlashda:
    // const user = await prisma.user.findFirst({
    //   where: { OR: [{ email: identifier }, { phone: identifier }] },
    // });
    // if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    //   return NextResponse.json({ success: false, error: "Telefon/email yoki parol noto'g'ri" }, { status: 401 });
    // }
    // if (user.isBlocked) {
    //   return NextResponse.json({ success: false, error: "Hisobingiz bloklangan" }, { status: 403 });
    // }

    // Demo mode
    void bcrypt;
    const demoUser = {
      id: "demo-user",
      firstName: "Demo",
      lastName: "User",
      email: identifier,
      role: identifier === "admin@fmimetall.uz" ? "ADMIN" : "USER",
    };

    return NextResponse.json({
      success: true,
      message: "Muvaffaqiyatli kirdingiz",
      data: demoUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Server xatosi" },
      { status: 500 }
    );
  }
}
