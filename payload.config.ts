import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import { Users } from "./src/collections/Users";
import { Products } from "./src/collections/Products";
import { Orders } from "./src/collections/Orders";
import { Customers } from "./src/collections/Customers";
import { BlogPosts } from "./src/collections/BlogPosts";
import { Categories } from "./src/collections/Categories";
import { Media } from "./src/collections/Media";
import { Wishlists } from "./src/collections/Wishlists";
import { Affiliates } from "./src/collections/Affiliates";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      views: {
        dashboard: {
          Component: "./src/components/admin/Dashboard",
        },
      },
    },
  },
  collections: [
    Users,
    Products,
    Orders,
    Customers,
    BlogPosts,
    Categories,
    Media,
    Wishlists,
    Affiliates,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "ferbm_placeholder_secret_key",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "postgresql://postgres:postgres@localhost:5432/ferbm",
    },
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp,
});
