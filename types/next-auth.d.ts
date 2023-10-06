import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string | null | undefined;
    channelId: string | undefined;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
