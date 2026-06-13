import { CollectionConfig } from "payload";

export const BlogPosts: CollectionConfig = {
  slug: "blogposts",
  labels: {
    singular: "مقاله",
    plural: "مقالات",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "category", "publishedAt"],
  },
  fields: [
    {
      name: "title",
      label: "عنوان مقاله",
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
      name: "content",
      label: "محتوای مقاله",
      type: "richText",
      required: true,
    },
    {
      name: "coverImage",
      label: "تصویر شاخص مقاله",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "category",
      label: "دسته‌بندی موضوعی",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "publishedAt",
      label: "تاریخ انتشار (شمسی/میلادی)",
      type: "date",
    },
    {
      name: "readingTime",
      label: "مدت زمان مطالعه (دقیقه)",
      type: "number",
      defaultValue: 5,
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
