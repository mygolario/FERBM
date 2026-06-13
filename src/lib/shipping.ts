export interface ShippingParams {
  originProvince: string;
  destProvince: string;
  weightGrams: number; // weight in grams
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
}

export interface ShippingCostResult {
  chapar: {
    name: string;
    cost: number;
    deliveryTimeDays: string;
    details: string;
  };
  tipax: {
    name: string;
    cost: number;
    deliveryTimeDays: string;
    details: string;
  };
}

export function calculateShipping(params: ShippingParams): ShippingCostResult {
  const { originProvince, destProvince, weightGrams } = params;

  // 1. Determine distance category
  let distanceCategory: "intra" | "neighbor" | "distant" = "distant";

  if (originProvince === destProvince) {
    distanceCategory = "intra";
  } else {
    // List of neighboring provinces to Tehran (which is our default origin)
    const tehranNeighbors = ["البرز", "مازندران", "قم", "سمنان", "قزوین", "مرکزی"];
    
    if (
      (originProvince === "تهران" && tehranNeighbors.includes(destProvince)) ||
      (destProvince === "تهران" && tehranNeighbors.includes(originProvince))
    ) {
      distanceCategory = "neighbor";
    }
  }

  // 2. Base costs (up to 1kg / 1000 grams)
  let chaparBase = 55000;
  let tipaxBase = 65000;

  if (distanceCategory === "neighbor") {
    chaparBase = 75000;
    tipaxBase = 85000;
  } else if (distanceCategory === "distant") {
    chaparBase = 95000;
    tipaxBase = 105000;
  }

  // 3. Excess weight calculation (above 1000 grams)
  const excessWeightKg = Math.max(0, (weightGrams - 1000) / 1000);
  const excessFeePerKg = 15000; // 15,000 Tomans per extra KG
  const excessCost = Math.ceil(excessWeightKg * excessFeePerKg);

  // 4. Fragile surcharge (ceramics wrapping and insurance)
  const chaparFragileSurcharge = 45000;
  const tipaxFragileSurcharge = 55000;

  // 5. Total Calculations
  const chaparTotal = chaparBase + excessCost + chaparFragileSurcharge;
  const tipaxTotal = tipaxBase + excessCost + tipaxFragileSurcharge;

  // 6. Delivery times
  let chaparTime = "۲ تا ۳ روز کاری";
  let tipaxTime = "۱ تا ۲ روز کاری";

  if (distanceCategory === "distant") {
    chaparTime = "۳ تا ۵ روز کاری";
    tipaxTime = "۲ تا ۳ روز کاری";
  }

  return {
    chapar: {
      name: "پست ویژه چاپار (شکستنی)",
      cost: chaparTotal,
      deliveryTimeDays: chaparTime,
      details: "بسته‌بندی ویژه کارگاهی اشیاء شکستنی با بیمه تعهد کامل کالا",
    },
    tipax: {
      name: "اکسپرس تیپاکس (سریع)",
      cost: tipaxTotal,
      deliveryTimeDays: tipaxTime,
      details: "ارسال سریع درب به درب، بیمه متناسب با ارزش واقعی محموله سفالی",
    },
  };
}
