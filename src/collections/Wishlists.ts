import { CollectionConfig } from "payload";

export const Wishlists: CollectionConfig = {
  slug: "wishlists",
  labels: {
    singular: "لیست علاقه‌مندی",
    plural: "لیست‌های علاقه‌مندی",
  },
  admin: {
    useAsTitle: "customer",
  },
  fields: [
    {
      name: "customer",
      label: "مشتری",
      type: "relationship",
      relationTo: "customers",
      required: true,
      unique: true,
    },
    {
      name: "products",
      label: "محصولات نشان‌شده",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
  ],
};
