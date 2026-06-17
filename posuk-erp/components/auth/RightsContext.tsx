"use client";
import { createContext, useContext } from "react";

export type RightEntry = { view: boolean; create: boolean; edit: boolean; delete: boolean; print: boolean };
export type RightsMap = Record<string, RightEntry>;

export const RightsContext = createContext<RightsMap>({});

export function useRights(screen: string): RightEntry {
  const map = useContext(RightsContext);
  return map[screen] ?? { view: false, create: false, edit: false, delete: false, print: false };
}
