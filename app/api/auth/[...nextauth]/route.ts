import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    {
      id: "streamelements",
      name: "StreamElements",
      type: "oauth",
      clientId: process.env.STREAMELEMENTS_CLIENTID,
      clientSecret: process.env.STREAMELEMENTS_CLIENTSECRET,
      authorization: {
        url: "https://api.streamelements.com/oauth2/authorize",
        params: {
          scope: "overlays:read overlays:write",
          redirect_uri: process.env.STREAMELEMENTS_REDIRECTURI,
        },
      },
      token: {
        async request(context) {
          const res = await fetch(
            "https://api.streamelements.com/oauth2/token",
            {
              method: "POST",
              body: new URLSearchParams({
                client_id: context.provider.clientId!,
                client_secret: context.provider.clientSecret!,
                grant_type: "authorization_code",
                code: context.params.code!,
                redirect_uri: process.env.STREAMELEMENTS_REDIRECTURI!,
              }),
            }
          );

          const data = await res.json();

          return {
            tokens: {
              ...data,
            },
          };
        },
      },
      userinfo: {
        async request(context) {
          const res = await fetch(
            "https://api.streamelements.com/kappa/v2/channels/me",
            {
              headers: {
                Authorization: `OAuth ${context.tokens.access_token}`,
              },
            }
          );

          const data = await res.json();

          if (!res.ok) {
            throw data;
          }

          await db.account.updateMany({
            data: {
              access_token: context.tokens.access_token,
              expires_at: context.tokens.expires_at,
              refresh_token: context.tokens.refresh_token,
            },
            where: {
              provider: "streamelements",
              providerAccountId: data._id,
            },
          });

          return data;
        },
      },
      async profile(profile) {
        return {
          id: profile._id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, user }) {
      const [account] = await db.account.findMany({
        where: { userId: user.id, provider: "streamelements" },
      });

      const res = await fetch(
        "https://api.streamelements.com/oauth2/validate",
        {
          headers: {
            Authorization: `OAuth ${account.access_token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // TODO https://authjs.dev/guides/basics/refresh-token-rotation
        await db.session.deleteMany({
          where: { userId: user.id },
        });

        throw data;
      }

      session.user.id = user.id;
      session.accessToken = account.access_token;
      session.channelId = account.providerAccountId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
