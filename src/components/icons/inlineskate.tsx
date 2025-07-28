import { SVGProps } from 'react';

export function InlineSkateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 16a.5.5 0 0 1 0-1h13a.5.5 0 0 1 0 1h-13Z" />
      <path d="M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M5 15V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9" />
      <path d="M5 9h14" />
    </svg>
  );
}
