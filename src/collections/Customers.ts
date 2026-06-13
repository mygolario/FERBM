import { CollectionConfig } from "payload";

export const Customers: CollectionConfig = {
  slug: "customers",
  labels: {
    singular: "مشتری",
    plural: "مشتریان",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "phone", "email"],
  },
  fields: [
    {
      name: "name",
      label: "نام و نام خانوادگی",
      type: "text",
      required: true,
    },
    {
      name: "phone",
      label: "شماره تلفن همراه (برای دریافت OTP)",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "email",
      label: "آدرس ایمیل",
      type: "email",
    },
    {
      name: "addresses",
      label: "آدرس‌های مشتری",
      type: "array",
      fields: [
        {
          name: "province",
          label: "استان",
          type: "text",
          required: true,
        },
        {
          name: "city",
          label: "شهر",
          type: "text",
          required: true,
        },
        {
          name: "fullAddress",
          label: "آدرس کامل پستی",
          type: "textarea",
          required: true,
        },
        {
          name: "postalCode",
          label: "کد پستی ۱۰ رقمی",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "orders",
      label: "تاریخچه سفارشات",
      type: "relationship",
      relationTo: "orders",
      hasMany: true,
    },
  ],
};
