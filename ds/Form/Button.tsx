"use client";
import Loader from "../Loader/Index";

type Props = {
  [x: string]: any;
  disabled?: boolean;
  size?: string;
  variant?: string;
  href?: string;
  to?: string;
  target?: string;
  loading?: boolean;
  icon?: any;
  text?: string;
  classColor?: string;
  children?: any;
  onClick?: any;
  className?: string;
  type?: string;
};

const Button = function (props: Props) {
  const {
    type,
    disabled = false,
    size,
    variant,
    href,
    to,
    target,
    loading,
    icon: Icon,
    text,
    classColor,
    onClick,
    className = "",
    ...extraProps
  } = props;

  const tag = () => {
    if (href) return "a";
    return "button";
  };

  const classNameColor = () => {
    if (classColor) {
      return classColor;
    } else if (disabled) {
      return "btn-disabled";
    } else if (variant === "primary") {
      return `btn-primary`;
    } else if (variant === "secondary") {
      return "btn-secondary";
    } else if (variant === "third") {
      return "btn-third";
    } else if (variant === "neutral") {
      return "btn-neutral";
    }
  };
  const classBtn = () => {
    return `btn ${className ? " " + className : ""}`;
  };

  const propsComputed = () => {
    const propsObj: any = { type: type || "button" };
    if (href) propsObj.href = href;
    if (to) propsObj.to = to;
    return propsObj;
  };

  const ComponentName = tag();

  return (
    <ComponentName
      className={`${classBtn()} ${classNameColor()} size-${size || "md"}`}
      target={target}
      {...extraProps}
      {...propsComputed()}
      onClick={onClick}
      disabled={disabled}
    >
      {(text || Icon) && (
        <div className="flex justify-center items-center gap-2">
          {loading && <Loader size="sm" className="shrink-0" />}
          {Icon && !loading && <Icon className={`h-full w-4 shrink-0`} />}
          {text && <span className="shrink-0">{text}</span>}
        </div>
      )}
      {!text && props.children}
    </ComponentName>
  );
};

export default Button;
