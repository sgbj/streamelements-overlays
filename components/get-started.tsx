"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function GetStarted() {
  return (
    <Card className="m-auto p-8 shadow-2xl">
      <h1 className="text-3xl font-bold">✨ Get started ✨</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 mb-6 leading-8">
        Generate links to easily share StreamElements overlays with your
        community.
        <br />
        Sign in below to get started.
      </p>
      <Button
        size="lg"
        className="text-md w-full"
        onClick={() => signIn("streamelements")}
      >
        Sign in with StreamElements
      </Button>
    </Card>
  );
}
