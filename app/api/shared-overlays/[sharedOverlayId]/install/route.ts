import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { sharedOverlayId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (!params.sharedOverlayId) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  const sharedOverlay = await db.sharedOverlay.findUnique({
    where: { id: params.sharedOverlayId, deletedAt: null },
  });

  if (!sharedOverlay) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  const res = await fetch(
    `https://api.streamelements.com/kappa/v2/overlays/${session.channelId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `OAuth ${session.accessToken}`,
      },
      body: JSON.stringify(sharedOverlay.data),
    }
  );
  const data = await res.json();

  return Response.json(data, { status: res.status });
}
