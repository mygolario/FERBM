import config from "@/payload.config";
import { RootPage } from "@payloadcms/next/views";
import { importMap } from "../../importMap";
import { DbMissingError } from "@/components/shared/DbMissingError";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

const Page = async ({ params, searchParams }: Args) => {
  if (!process.env.DATABASE_URI) {
    return <DbMissingError />;
  }

  return (
    <RootPage
      config={config}
      params={params}
      searchParams={searchParams}
      importMap={importMap}
    />
  );
};

export default Page;
