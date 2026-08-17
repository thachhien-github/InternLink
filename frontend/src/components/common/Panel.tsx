import { ReactNode, HTMLAttributes } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** padding: default md */
  padding?: "none" | "sm" | "md";
  className?: string;
}

const padClass = {
  none: "",
  sm: "p-3",
  md: "p-4 md:p-5",
};

/** Flat content panel — prefer over nested white cards. */
export function Panel({
  children,
  padding = "md",
  className = "",
  ...rest
}: PanelProps) {
  return (
    <div
      className={`il-panel ${padClass[padding]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
