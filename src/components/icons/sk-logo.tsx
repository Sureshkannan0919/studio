import { cn } from "@/lib/utils";

export default function SkLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 100"
      className={cn("text-foreground", className)}
      aria-label="SK Skates Logo"
    >
      <defs>
        <linearGradient id="sk-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
        </linearGradient>
      </defs>
      <g fill="url(#sk-gradient)">
        {/* S */}
        <path d="M75,20 C40,20 40,50 75,50 C110,50 110,80 75,80 L50,80" fill="none" stroke="url(#sk-gradient)" strokeWidth="12" strokeLinecap="round" />
        
        {/* K */}
        <path d="M120,20 L120,80" fill="none" stroke="url(#sk-gradient)" strokeWidth="12" strokeLinecap="round" />
        <path d="M160,20 L120,50 L160,80" fill="none" stroke="url(#sk-gradient)" strokeWidth="12" strokeLinecap="round" />
      </g>
    </svg>
  );
}
