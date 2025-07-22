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
      <path d="M6.482 16.208 8.32 7.5h7.36l1.838 8.708" />
      <path d="M19.345 16.208c.34-.142.655-.36.89-.642.47-.568.665-1.32.42-2.02l-1.84-5.22a2 2 0 0 0-1.89-1.32H9.085a2 2 0 0 0-1.89 1.325l-1.84 5.22c-.244.699-.05 1.451.42 2.02.235.282.55.5.89.642" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}
