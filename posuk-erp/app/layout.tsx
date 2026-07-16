import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "POS UK ERP",
  description: "Point of Sale & ERP for UK wholesale businesses",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const initialTheme = session?.user?.theme === "dark" ? "dark" : "light";

  return (
    <html lang="en" data-theme={initialTheme} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers initialTheme={initialTheme}>{children}</Providers>
      </body>
    </html>
  );
}
