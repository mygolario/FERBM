import { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "دسته‌بندی",
    plural: "دسته‌بندی‌ها",
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      label: "نام دسته‌بندی",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      label: "آدرس URL (اسلاگ)",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "parent",
      label: "دسته‌بندی والد",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "icon",
      label: "آیکون / تصویر دسته‌بندی",
      type: "upload",
      relationTo: "media",
    },
  ],
};
