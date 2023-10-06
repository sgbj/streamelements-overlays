"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { SharedOverlay, User } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { UpdateIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function InstallOverlay({
  sharedOverlay,
}: {
  sharedOverlay: SharedOverlay & { user: User };
}) {
  const session = useSession();
  const [status, setStatus] = useState<
    "" | "installing" | "installed" | "error"
  >("");

  async function onInstall() {
    setStatus("installing");

    try {
      const res = await fetch(
        `/api/shared-overlays/${sharedOverlay.id}/install`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setStatus("installed");
      } else {
        setStatus("error");
      }
    } catch (ex) {
      console.log(ex);
      setStatus("error");
    }
  }

  return (
    <Card className="m-auto p-8 shadow-2xl">
      {session.status !== "authenticated" && (
        <p className="text-center text-lg text-slate-600 dark:text-slate-400 leading-8 mb-8">
          Sign in to install this overlay.
        </p>
      )}
      {status === "installed" && (
        <p className="text-center text-lg text-slate-600 dark:text-slate-400 leading-8 mb-8">
          Overlay installed!
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-lg text-slate-600 dark:text-slate-400 leading-8 mb-8">
          An error occurred! Please try again.
        </p>
      )}
      <div className="flex items-center justify-center mb-8">
        <div
          className="rounded bg-cover bg-center w-24 h-24 me-4"
          style={{ backgroundImage: `url("${sharedOverlay.preview}")` }}
        />
        <div>
          <h1 className="text-3xl font-bold border-b pb-2 mb-2">
            {sharedOverlay.name}
          </h1>
          <div className="flex items-center">
            <Avatar className="w-6 h-6 me-2">
              <AvatarImage
                src={sharedOverlay.user.image ?? ""}
                alt={`${sharedOverlay.user.name}'s avatar`}
              />
            </Avatar>
            {sharedOverlay.user.name}
          </div>
        </div>
      </div>
      {session.status !== "authenticated" && (
        <Button
          size="lg"
          className="text-md w-full"
          onClick={() => signIn("streamelements")}
        >
          Sign in with StreamElements
        </Button>
      )}
      {session.status === "authenticated" && (
        <>
          {status !== "installed" && (
            <Button
              size="lg"
              variant="secondary"
              className="text-md w-full"
              onClick={onInstall}
              disabled={status === "installing"}
            >
              {status === "installing" ? (
                <>
                  <span className="mr-2">Installing overlay</span>
                  <UpdateIcon className="w-4 h-4 animate-spin" />
                </>
              ) : (
                "Install overlay"
              )}
            </Button>
          )}
          {status === "installed" && (
            <Button size="lg" className="text-md w-full" asChild>
              <Link href="https://streamelements.com/dashboard/overlays">
                Go to StreamElements dashboard
              </Link>
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
