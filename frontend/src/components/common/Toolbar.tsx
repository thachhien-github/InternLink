import { ReactNode } from "react";

interface ToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Page chrome row — border-bottom, not a rounded card. */
export function Toolbar({
  left,
  right,
  children,
  className = "",
}: ToolbarProps) {
  return (
    <div className={`il-toolbar ${className}`.trim()}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {left}
        {children}
      </div>
      {right && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          {right}
        </div>
      )}
    </div>
  );
}
