import { auth } from "@clerk/nextjs/server";
import NoPermissionCard from "./NoPermissionCard";

export default async function HasPermission({
  permission,
  renderFallback,
  fallbackText,
  children,
}: {
  permission: (userId: string | null) => Promise<boolean>;
  renderFallback?: boolean;
  fallbackText?: string;
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const hasPerission = await permission(userId);
  if (hasPerission) return children;
  if (renderFallback)
    return <NoPermissionCard>{fallbackText}</NoPermissionCard>;
  return null;
}
