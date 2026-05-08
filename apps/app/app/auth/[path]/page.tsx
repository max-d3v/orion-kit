import { Auth } from "@workspace/ui/components/auth/custom/auth-custom";
import { customViewPaths } from "@workspace/ui/hooks/custom-view-paths";
import { notFound } from "next/navigation";

export default async function AuthPage({
  params,
}: {
  params: Promise<{
    path: string;
  }>;
}) {
  const { path } = await params;

  if (!Object.values(customViewPaths.auth).includes(path)) {
    notFound();
  }

  return (
    <div className="my-auto flex justify-center p-4 md:p-6">
      <Auth path={path} />
    </div>
  );
}
