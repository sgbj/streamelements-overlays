import { InstallOverlay } from "@/components/install-overlay";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SharePage({
  params,
}: {
  params: { sharedOverlayId: string };
}) {
  const sharedOverlay = await db.sharedOverlay.findUnique({
    where: {
      id: params.sharedOverlayId,
      deletedAt: null,
    },
    include: {
      user: true,
    },
  });

  if (!sharedOverlay) {
    redirect("/");
  }

  return <InstallOverlay sharedOverlay={sharedOverlay} />;
}
