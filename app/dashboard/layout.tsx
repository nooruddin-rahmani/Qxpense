import { Suspense } from "react";
import Loading from "../loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}
