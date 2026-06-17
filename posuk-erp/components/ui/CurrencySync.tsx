"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchArray } from "@/lib/fetchJson";
import { setCurrency } from "@/lib/currency";

export function CurrencySync() {
  const { data = [] } = useQuery<{ key: string; value: string }[]>({
    queryKey: ["preferences"],
    queryFn: () => fetchArray("/api/preferences"),
    staleTime: 60_000,
  });

  useEffect(() => {
    const pref = data.find((p) => p.key === "currency");
    if (pref) setCurrency(pref.value);
  }, [data]);

  return null;
}
