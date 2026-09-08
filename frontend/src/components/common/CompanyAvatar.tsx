import React from "react";

function getCompanyInitials(companyName: string): string {
  const parts = companyName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "DN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function companyToGradient(companyName: string): string {
  let hash = 0;
  for (let index = 0; index < companyName.length; index += 1) {
    hash = companyName.charCodeAt(index) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `linear-gradient(135deg, hsl(${hue}, 62%, 52%), hsl(${(hue + 42) % 360}, 68%, 42%))`;
}

interface CompanyAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function CompanyAvatar({
  name,
  size = 48,
  className = "",
}: CompanyAvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-md text-white font-bold shadow-sm select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: companyToGradient(name),
        fontSize: size * 0.32,
        lineHeight: 1,
      }}
      title={name}
      aria-label={name}
    >
      {getCompanyInitials(name)}
    </div>
  );
}