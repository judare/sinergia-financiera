"use client";
import { useEffect, useState, useId } from "react";
import { cn } from "@/lib/utils";

type InputProps = {
  disabled?: boolean;
  label?: string | any;
  placeholder?: string;
  className?: string;
  name?: string;
  value?: string;
  icon?: any;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  type?:
    | "text"
    | "password"
    | "number"
    | "date"
    | "email"
    | "url"
    | "tel"
    | "color";
  autoComplete?: "on" | "off";
  size?: "sm" | "md" | "lg";
};

export default function Input(props: InputProps) {
  const [activeLabel, setActiveLabel] = useState(false);
  const id = useId();
  const [error, setError] = useState<any>(props.error);

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  const inputProps = {
    ...props,
    size: undefined,
  };

  // const Icon = props.icon;

  return (
    <div
      className={cn(
        "relative bg-neutral-100 cursor-text flex flex-col rounded-lg px-3 py-2 font-light text-neutral-700 border border-transparent  ",
        error ? "border-red-500 text-red-500" : "",
        props.className
      )}
    >
      {props.label && (
        <label
          onClick={() => {
            const el = document.getElementById(id);
            if (el) el.focus();
          }}
          htmlFor={id}
          className={`font-medium text-xs  ${props.size || "md"} ${
            activeLabel || props.value || props.type === "date"
              ? "active"
              : "inactive "
          }`}
        >
          {props.label}
        </label>
      )}
      <input
        {...inputProps}
        autoComplete={props.autoComplete || "on"}
        id={id}
        onChange={(e) => {
          props.onChange && props.onChange(e.target.value);
          if (error) {
            setError(null);
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onBlur={() => {
          setActiveLabel(false);
          props.onBlur && props.onBlur();
        }}
        onFocus={() => {
          setActiveLabel(true);
          props.onFocus && props.onFocus();
        }}
        disabled={props.disabled || false}
        value={props.value || ""}
        className={`bg-transparent py-1 w-full outline-none  ${
          props.size || "md"
        } ${props.error ? "error" : ""}  `}
        type={props.type}
        placeholder={props.placeholder}
        name={props.name}
      />
    </div>
  );
}
