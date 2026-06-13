import { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "سفارش",
    plural: "سفارشات",
  },
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "customer", "totalAmount", "paymentStatus", "createdAt"],
  },
  fields: [
    {
      name: "orderNumber",
      label: "شماره سفارش",
      type: "text",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "customer",
      label: "مشتری",
      type: "relationship",
      relationTo: "customers",
      required: true,
    },
    {
      name: "items",
      label: "اقلام سفارش",
      type: "array",
      required: true,
      fields: [
        {
          name: "product",
          label: "محصول",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          label: "تعداد",
          type: "number",
          required: true,
          defaultValue: 1,
        },
        {
          name: "priceAtPurchase",
          label: "قیمت در زمان خرید (تومان)",
          type: "number",
          required: true,
        },
      ],
    },
    {
      name: "subtotal",
      label: "جمع کل اقلام (تومان)",
      type: "number",
      required: true,
    },
    {
      name: "shippingFee",
      label: "هزینه ارسال (تومان)",
      type: "number",
      required: true,
    },
    {
      name: "shippingMethod",
      label: "روش ارسال",
      type: "select",
      options: [
        { label: "پست چاپار (Fragile - بیمه ویژه شکستنی)", value: "chapar" },
        { label: "تیپاکس (Tipax)", value: "tipax" },
      ],
      required: true,
      defaultValue: "chapar",
    },
    {
      name: "totalAmount",
      label: "مبلغ نهایی پرداختی (تومان)",
      type: "number",
      required: true,
    },
    {
      name: "paymentStatus",
      label: "وضعیت پرداخت",
      type: "select",
      options: [
        { label: "در انتظار پرداخت", value: "pending_payment" },
        { label: "پرداخت شده", value: "paid" },
        { label: "در حال آماده‌سازی", value: "preparing" },
        { label: "ارسال شده (تحویل به پست)", value: "shipped" },
        { label: "تحویل داده شده", value: "delivered" },
        { label: "لغو شده", value: "cancelled" },
      ],
      required: true,
      defaultValue: "pending_payment",
    },
    {
      name: "zibalTrackId",
      label: "شناسه تراکنش زیبال (Track ID)",
      type: "text",
    },
    {
      name: "shippingAddress",
      label: "آدرس ارسال",
      type: "group",
      fields: [
        {
          name: "recipientName",
          label: "نام گیرنده",
          type: "text",
          required: true,
        },
        {
          name: "recipientPhone",
          label: "شماره تماس گیرنده",
          type: "text",
          required: true,
        },
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
          label: "کد پستی",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "jalaliCreatedAt",
      label: "تاریخ ثبت سفارش (شمسی)",
      type: "text",
      admin: {
        readOnly: true,
      },
    },
  ],
};
