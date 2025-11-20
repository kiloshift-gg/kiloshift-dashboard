export interface IconProps {
  className?: string;
  size?: 18 | 14 | 12 | 8;
}

export const HeartIcon = ({ className, size = 18 }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      className={className}
      fill="none"
    >
      <path
        fill="#0FF"
        d="M12.164 2.5A4.62 4.62 0 0 0 9 3.806 4.64 4.64 0 0 0 5.822 2.5c-2.53.015-4.582 2.084-4.572 4.609 0 5.253 5.306 8.429 6.932 9.278a1.77 1.77 0 0 0 1.635 0c1.626-.848 6.933-4.024 6.933-9.275.009-2.528-2.042-4.597-4.586-4.612"
      ></path>
    </svg>
  );
};
