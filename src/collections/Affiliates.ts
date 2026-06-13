import { CollectionConfig } from "payload";

export const Affiliates: CollectionConfig = {
  slug: "affiliates",
  labels: {
    singular: "همکار فروش",
    plural: "همکاران فروش",
  },
  admin: {
    useAsTitle: "affiliateName",
    defaultColumns: ["affiliateName", "referralCode", "commissionRate", "totalSales", "totalEarnings"],
  },
  fields: [
    {
      name: "affiliateName",
      label: "نام همکار فروش",
      type: "text",
      required: true,
    },
    {
      name: "referralCode",
      label: "کد معرف (تک کلمه انگلیسی)",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "commissionRate",
      label: "درصد کمیسیون (٪)",
      type: "number",
      required: true,
      defaultValue: 10,
    },
    {
      name: "totalSales",
      label: "مجموع کل سفارشات معرفی شده (تومان)",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "totalEarnings",
      label: "مجموع کل درآمد کمیسیون (تومان)",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "referredOrders",
      label: "سفارش‌های ثبت شده با این کد",
      type: "relationship",
      relationTo: "orders",
      hasMany: true,
    },
  ],
};
