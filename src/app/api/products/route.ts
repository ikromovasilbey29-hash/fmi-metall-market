import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const popular = searchParams.get("popular");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    // TODO: DB bilan:
    // const where = {
    //   ...(category ? { category: { slug: category } } : {}),
    //   ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
    //   ...(popular === "true" ? { isPopular: true } : {}),
    // };
    // const [data, total] = await Promise.all([
    //   prisma.product.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, include: { category: true, metalType: true } }),
    //   prisma.product.count({ where }),
    // ]);

    void category; void search; void popular; void page; void pageSize;

    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Admin autentifikatsiyasini tekshiring
    // TODO: prisma.product.create(...)
    void body;
    return NextResponse.json({ success: true, message: "Mahsulot qo'shildi" });
  } catch (error) {
    console.error("Product create error:", error);
    return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 });
  }
}
