import { NextResponse } from "next/server";
import { calculateShipping } from "@/lib/shipping";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { originProvince, destProvince, weightGrams } = body;

    if (!destProvince || !weightGrams) {
      return NextResponse.json(
        { message: "مقصد و وزن مرسوله الزامی است." },
        { status: 400 }
      );
    }

    const rates = calculateShipping({
      originProvince: originProvince || "تهران",
      destProvince,
      weightGrams: Number(weightGrams),
    });

    return NextResponse.json(rates);
  } catch (error) {
    console.error("Shipping Calculate API Error:", error);
    return NextResponse.json(
      { message: "خطا در محاسبه هزینه ارسال" },
      { status: 500 }
    );
  }
}
