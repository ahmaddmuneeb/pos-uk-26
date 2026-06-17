"use client";

import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";

const apiClient = axios.create({
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<{ error?: string }>) => {
    if (err.response?.status === 401) {
      await signOut({ callbackUrl: "/login" });
      return;
    }
    const message = err.response?.data?.error ?? err.message ?? "Something went wrong.";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
