import { forwardRef, type SVGProps } from 'react';

export const AiIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function AiIcon({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <rect x="2.5" y="3.5" width="19" height="17" rx="4" />
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="9"
          fontWeight="800"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fill="currentColor"
          stroke="none"
          letterSpacing="0.5"
        >
          AI
        </text>
      </svg>
    );
  },
);
