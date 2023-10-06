"use client";

import { CopyIcon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { SharedOverlay } from "@prisma/client";
import { toast } from "./ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function OverlayCard({
  sharedOverlay,
}: {
  sharedOverlay: SharedOverlay;
}) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function onCopy() {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/share/${sharedOverlay.id}`
    );
    toast({
      title: "Link copied to clipboard!",
      description: (
        <div className="rounded mt-2 p-2 pr-3 bg-accent flex items-center">
          <div
            className="rounded bg-cover bg-center w-8 h-8 mr-2"
            style={{ backgroundImage: `url(${sharedOverlay.preview})` }}
          />
          {sharedOverlay.name}
        </div>
      ),
    });
  }

  async function onDelete() {
    setLoading(true);

    try {
      await fetch(`/api/shared-overlays/${sharedOverlay.id}`, {
        method: "DELETE",
      });
    } catch (ex) {
      console.log(ex);
    }

    setLoading(false);
    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <Card className="relative p-3 flex flex-col space-y-4 md:flex-row md:space-y-0">
      <div className="flex-grow flex-shrink-0 flex items-center space-x-4">
        <div
          className="rounded bg-cover bg-center w-10 h-10"
          style={{ backgroundImage: `url(${sharedOverlay.preview})` }}
        />
        <div className="font-semibold">{sharedOverlay.name}</div>
      </div>
      <div className="flex-shrink-0 flex items-center space-x-2">
        <Input
          value={`${process.env.NEXT_PUBLIC_URL}/share/${sharedOverlay.id}`}
          onFocus={(e) => e.target.select()}
          readOnly
          className="me-2"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Copy"
                className="text-foreground/60 focus:text-foreground flex-shrink-0"
                onClick={onCopy}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete"
                className="text-rose-600/60 hover:text-rose-600 focus:text-rose-600 dark:text-rose-400/50 dark:hover:text-rose-400 focus:dark:text-rose-400 flex-shrink-0"
                onClick={() => setDeleteOpen(true)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog open={deleteOpen} onOpenChange={(open) => setDeleteOpen(open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stop sharing overlay?</DialogTitle>
            </DialogHeader>
            <div className="text-slate-600 dark:text-slate-400">
              The share link to{" "}
              <span className="font-semibold text-foreground">
                {sharedOverlay.name}
              </span>{" "}
              will no longer work. This action cannot be undone.
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => setDeleteOpen(false)}
              >
                {" "}
                Cancel
              </Button>
              <Button
                className="text-rose-50 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800"
                onClick={onDelete}
                disabled={loading}
              >
                Delete
                {loading && (
                  <UpdateIcon className="ml-2 w-4 h-4 animate-spin" />
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
