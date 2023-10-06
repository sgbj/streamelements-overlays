import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { GetStarted } from "@/components/get-started";
import { ManageOverlays } from "@/components/manage-overlays";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <GetStarted />;
  }

  const overlays = await fetch(
    `https://api.streamelements.com/kappa/v2/overlays/${session.channelId}`,
    {
      headers: {
        Authorization: `OAuth ${session.accessToken}`,
      },
    }
  ).then((res) => res.json());

  const sharedOverlays = await db.sharedOverlay.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ManageOverlays overlays={overlays} sharedOverlays={sharedOverlays} />;
}
