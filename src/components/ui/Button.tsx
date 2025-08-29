import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";

// 🎨 Button 변형 타입
type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "outline"
  | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// 🏗️ 기본 공통 Props
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

// 🔘 Button 타입별 Props (Union Types 활용)
type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    to?: never;
    href?: never;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<LinkProps, "className"> & {
    as: "link";
    to: string;
    onClick?: never;
    type?: never;
    disabled?: never;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

// 🎨 스타일 매핑 (const assertion으로 타입 안전성 강화)
const buttonVariants = {
  primary:
    "bg-[#FAC638] text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
  secondary:
    "bg-white font-light text-[#1c180d] hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300",
  tertiary:
    "bg-[#f4f0e6] text-[#1c180d] hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
  outline:
    "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100",
  ghost:
    "text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100",
} as const;

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm font-medium",
  md: "px-4 py-2 text-base ",
  lg: "px-6 py-3 text-lg font-semibold",
} as const;

// 🌀 로딩 스피너 컴포넌트
function LoadingSpinner({
  size,
  className,
}: {
  size: ButtonSize;
  className?: string;
}) {
  const sizeMap = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  } as const;

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeMap[size],
        className
      )}
      aria-hidden="true"
    />
  );
}

// ✨ Main Button Component (React 19 - forwardRef 없이 ref 지원)
function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  as,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement> }) {
  // 🎨 기본 스타일 클래스
  const baseClassName = cn(
    // 기본 스타일
    "inline-flex items-center justify-center rounded-lg border-0",
    "transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50",

    // 변형별 스타일
    buttonVariants[variant],

    // 크기별 스타일
    buttonSizes[size],

    // 조건부 스타일
    fullWidth && "w-full",
    isLoading && "cursor-wait pointer-events-none",

    // 커스텀 클래스
    className
  );

  // 🎯 버튼 내용 렌더링
  const content = (
    <>
      {/* 왼쪽 아이콘 또는 로딩 스피너 */}
      {isLoading ? (
        <LoadingSpinner size={size} className="mr-2" />
      ) : leftIcon ? (
        <span className="mr-2 flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}

      {/* 텍스트 콘텐츠 */}
      <span className={isLoading ? "opacity-70" : undefined}>{children}</span>

      {/* 오른쪽 아이콘 (로딩 중이 아닐 때만) */}
      {rightIcon && !isLoading && (
        <span className="ml-2 flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  // 🔗 Link로 렌더링 (React Router)
  if (as === "link") {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={baseClassName}
        {...(props as LinkProps)}
      >
        {content}
      </Link>
    );
  }

  // 🔘 기본 버튼으로 렌더링
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseClassName}
      disabled={
        (props as ButtonHTMLAttributes<HTMLButtonElement>).disabled || isLoading
      }
      aria-busy={isLoading}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

Button.displayName = "Button";

export default Button;
