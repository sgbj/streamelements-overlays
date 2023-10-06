"use client";

import { useSession, signOut } from "next-auth/react";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function NavMenu() {
  const session = useSession();

  return (
    <header className="flex-shrink-0 container flex h-14 items-center space-x-2">
      <Link href="/" className="font-bold mr-auto">
        Share StreamElements Overlays
      </Link>
      <ModeToggle />
      {session.status === "authenticated" && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-9 h-9">
              <AvatarImage
                src={session.data.user.image ?? ""}
                alt={`${session.data.user.name}'s avatar`}
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{session.data.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Sign out
              <DropdownMenuShortcut>
                <ExitIcon className="w-4 h-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
