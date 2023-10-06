import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const { overlayId } = await req.json();

  if (!overlayId) {
    return new Response("Bad Request", {
      status: 400,
    });
  }

  const res = await fetch(
    `https://api.streamelements.com/kappa/v2/overlays/${session.channelId}/${overlayId}`,
    {
      headers: {
        Authorization: `OAuth ${session.accessToken}`,
      },
    }
  );
  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  const sharedOverlay = await db.sharedOverlay.create({
    data: {
      name: data.name,
      preview: data.preview,
      overlayId,
      data,
      userId: session.user.id,
    },
  });

  return Response.json(sharedOverlay);
}
