"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { OverlayCard } from "@/components/overlay-card";
import { SharedOverlay } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdateIcon } from "@radix-ui/react-icons";

const FormSchema = z.object({
  overlayId: z.string().min(1, "Please select an overlay to share."),
});

export function ManageOverlays({
  overlays,
  sharedOverlays,
}: {
  overlays: any;
  sharedOverlays: SharedOverlay[];
}) {
  const router = useRouter();
  const [shareOpen, setShareOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      overlayId: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await fetch("/api/shared-overlays", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create shared overlay.");
      }

      const sharedOverlay = await res.json();

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
    } catch (ex) {
      console.log(ex);
    }

    form.reset();
    setShareOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Shared overlays
        </h1>
        <Button
          size="lg"
          className="text-md"
          onClick={() => setShareOpen(true)}
        >
          Share
        </Button>
        <Dialog
          open={shareOpen}
          onOpenChange={(open) => {
            setShareOpen(open);
            form.reset();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share overlay</DialogTitle>
              <DialogDescription>
                Generate a link to easily share an overlay with your friends.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="overlayId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overlay</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an overlay" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {overlays.docs.map((overlay: any) => (
                            <SelectItem key={overlay._id} value={overlay._id}>
                              {overlay.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Share
                    {form.formState.isSubmitting && (
                      <UpdateIcon className="ml-2 w-4 h-4 animate-spin" />
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-y-4">
        {sharedOverlays.map((sharedOverlay) => (
          <OverlayCard key={sharedOverlay.id} sharedOverlay={sharedOverlay} />
        ))}
        {sharedOverlays.length === 0 && (
          <p className="text-center my-8 text-xl text-slate-600 dark:text-slate-400 leading-8">
            You haven&apo;t shared any overlays yet. 🥺
          </p>
        )}
      </div>
    </>
  );
}
