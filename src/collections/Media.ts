import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "رسانه",
    plural: "رسانه‌ها",
  },
  admin: {
    useAsTitle: "alt",
  },
  upload: {
    staticDir: "public/media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: null,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      label: "متن جایگزین (توضیح تصویر برای سئو)",
      type: "text",
      required: true,
    },
  ],
};
