"use client";
import { Toaster, toast } from "sonner";
import { useTheme } from "@/components/theme/ThemeProvider";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      {children}
      <Toaster position="bottom-right" richColors theme={theme} closeButton />
    </>
  );
}

export function useToast() {
  return {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast.info(msg),
  };
}
