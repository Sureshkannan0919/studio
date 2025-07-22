import { SVGProps } from 'react';

export function SkateboardIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M14.5 7.5a1 1 0 0 0-1-1H12a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1Z" />
      <path d="m21.5 13-2-2-1.5 3.5 1 1.5 2.5-3Z" />
      <path d="m8.5 20-3-3-1 3.5 3 1 1-1.5Z" />
      <path d="M16 21H8.5l-3-3-.5-4 4-1 2-3h3l2 3 4 1-.5 4Z" />
    </svg>
  );
}
