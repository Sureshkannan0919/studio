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
      <path d="M6 3h12l2 4H4l2-4Z" />
      <path d="M2 7h20" />
      <path d="M12 7v10" />
      <path d="M6 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M18 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  );
}
