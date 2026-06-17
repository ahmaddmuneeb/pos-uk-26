"use client";

import apiClient from "./apiClient";

export async function fetchArray<T>(url: string): Promise<T[]> {
  try {
    const { data } = await apiClient.get<T[]>(url);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
