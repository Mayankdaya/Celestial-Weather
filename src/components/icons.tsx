import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 16l-4-4 4-4" />
      <path d="M10 8l-4 4 4 4" />
      <rect width="18" height="18" x="3" y="3" rx="2" />
    </svg>
  );
}
