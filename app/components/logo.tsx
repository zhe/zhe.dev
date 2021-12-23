import React from "react";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-8 fill-current ${className}`}
      viewBox="0 0 116.5 72"
    >
      <path d="M0,72V0H72M44.5,72h72V0" />
    </svg>
  );
}
