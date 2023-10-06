import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(
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

  const { overlayId, name, preview } = await req.json();

  if (!overlayId || !name || !preview) {
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

  const sharedOverlay = await db.sharedOverlay.update({
    where: { id: params.sharedOverlayId, userId: session.user.id },
    data: {
      name,
      preview,
      overlayId,
      data,
    },
  });

  if (!sharedOverlay) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  return Response.json(sharedOverlay);
}

export async function DELETE(
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

  const sharedOverlay = await db.sharedOverlay.update({
    where: { id: params.sharedOverlayId, userId: session.user.id },
    data: {
      deletedAt: new Date(),
    },
  });

  if (!sharedOverlay) {
    return new Response("Not Found", {
      status: 404,
    });
  }

  return Response.json(sharedOverlay);
}
