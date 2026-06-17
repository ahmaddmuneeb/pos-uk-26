import * as React from "react";

export interface NavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Active (current) state. @default false */
  active?: boolean;
  children?: React.ReactNode;
}

export interface NavSectionProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Sidebar navigation link with active accent state. */
export function NavItem(props: NavItemProps): JSX.Element;
/** Uppercase overline grouping a set of nav items. */
export function NavSection(props: NavSectionProps): JSX.Element;
