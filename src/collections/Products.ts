import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "محصول",
    plural: "محصولات",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "price", "isSoldOut", "inStock", "isUnique"],
  },
  fields: [
    {
      name: "title",
      label: "نام محصول",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "آدرس URL (یکتا)",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      label: "توضیحات محصول",
      type: "richText",
    },
    {
      name: "price",
      label: "قیمت (تومان)",
      type: "number",
      required: true,
    },
    {
      name: "images",
      label: "تصاویر محصول",
      type: "array",
      fields: [
        {
          name: "image",
          label: "تصویر",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "category",
      label: "دسته‌بندی",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "isUnique",
      label: "تک نسخه (یونیک)",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "isSoldOut",
      label: "ناموجود (اتمام موجودی)",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "inStock",
      label: "موجودی انبار",
      type: "number",
      defaultValue: 1,
    },
    {
      name: "weight",
      label: "وزن تقریبی (گرم) - برای محاسبه هزینه پست",
      type: "number",
      defaultValue: 500,
    },
    {
      name: "dimensions",
      label: "ابعاد بسته‌بندی",
      type: "group",
      fields: [
        {
          name: "length",
          label: "طول (سانتی‌متر)",
          type: "number",
        },
        {
          name: "width",
          label: "عرض (سانتی‌متر)",
          type: "number",
        },
        {
          name: "height",
          label: "ارتفاع (سانتی‌متر)",
          type: "number",
        },
      ],
    },
    {
      name: "seoTitle",
      label: "عنوان سئو (SEO Title)",
      type: "text",
    },
    {
      name: "seoDescription",
      label: "توضیحات سئو (SEO Description)",
      type: "textarea",
    },
    {
      name: "tags",
      label: "برچسب‌ها",
      type: "array",
      fields: [
        {
          name: "tag",
          label: "برچسب",
          type: "text",
        },
      ],
    },
  ],
};
