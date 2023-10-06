import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/session-provider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Toaster } from "@/components/ui/toaster";
import { NavMenu } from "@/components/nav-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Share StreamElements Overlays",
  description: "Made with ❣️ by sgbj and LevelUpLuci",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${inter.className} min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-200/60 via-slate-200/40 to-purple-200/60 dark:from-blue-900/20 dark:via-slate-900/10 dark:to-purple-900/20`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider session={session}>
              <NavMenu />
              <main className="container flex-grow flex-shrink-0 py-14 flex flex-col">
                {children}
              </main>
              <footer className="flex h-14 items-center justify-center flex-shrink-0">
                <p>
                  Made with ❣️ by{" "}
                  <a
                    href="https://github.com/sgbj"
                    className="text-sky-700 hover:text-sky-900 dark:text-sky-500 dark:hover:text-sky-300"
                  >
                    sgbj
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://levelupluci.carrd.co/"
                    className="text-sky-700 hover:text-sky-900 dark:text-sky-500 dark:hover:text-sky-300"
                  >
                    LevelUpLuci
                  </a>
                </p>
              </footer>
              <Toaster />
            </SessionProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
