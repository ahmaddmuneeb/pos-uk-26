"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/components/feedback/Toast";
import { ThemeProvider, type Theme } from "@/components/theme/ThemeProvider";

export function Providers({ children, initialTheme }: { children: React.ReactNode; initialTheme: Theme }) {
  const [qc] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }));
  return (
    <SessionProvider>
      <ThemeProvider initialTheme={initialTheme}>
        <QueryClientProvider client={qc}>
          <ToastProvider>{children}</ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
