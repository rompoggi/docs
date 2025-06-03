import clsx from 'clsx';
import { css } from 'styled-components';

import { Text, TextType } from '@/components';

type IconProps = TextType & {
  iconName: string;
  variant?: 'filled' | 'outlined';
};
export const Icon = ({
  iconName,
  variant = 'outlined',
  ...textProps
}: IconProps) => {
  if (iconName === 'moodle') {
    return <Text style={{ color: 'orange', fontWeight: 'bold' }}>Moodle</Text>;
  }
  return (
    <Text
      {...textProps}
      className={clsx('--docs--icon-bg', textProps.className, {
        'material-icons-filled': variant === 'filled',
        'material-icons': variant === 'outlined',
      })}
    >
      {iconName}
    </Text>
  );
};

type IconOptionsProps = TextType & {
  isHorizontal?: boolean;
};

export const IconOptions = ({ isHorizontal, ...props }: IconOptionsProps) => {
  return (
    <Icon
      {...props}
      iconName={isHorizontal ? 'more_horiz' : 'more_vert'}
      $css={css`
        user-select: none;
        ${props.$css}
      `}
    />
  );
};

export const MoodleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || 32}
    height={props.height || 32}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Orange 'm' */}
    <path
      d="M12 48V28c0-6.627 5.373-12 12-12s12 5.373 12 12v20h-6V28c0-3.314-2.686-6-6-6s-6 2.686-6 6v20h-6z"
      fill="#F9A825"
    />

    {/* Mortarboard hat */}
    <rect
      x="18"
      y="12"
      width="28"
      height="6"
      rx="1"
      fill="#444"
      transform="rotate(-15 18 12)"
    />
    <polygon points="18,15 32,8 46,15 32,22" fill="#444" />

    {/* Tassel */}
    <rect x="31" y="22" width="2" height="10" rx="1" fill="#222" />
    <ellipse cx="32" cy="33" rx="2" ry="3" fill="#444" />
  </svg>
);
