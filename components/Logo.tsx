type LogoProps = {
  size?: number;
  className?: string;
};

export default function Logo({ size = 24, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="efface"
      role="img"
    >
      <rect x="32" y="32" width="58" height="58" rx="10" fill="#3b6dff" />
      <rect x="12" y="12" width="58" height="58" rx="10" fill="#0a0a0a" />
    </svg>
  );
}
