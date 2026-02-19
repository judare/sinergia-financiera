"use client";
import { cn } from "@/lib/utils";
import { useId, useState, useEffect } from "react";

interface SelectProps {
  [x: string]: any;
  label?: string;
  value: string;
  placeholder?: string;
  error?: string | null;
  size?: "sm" | "md";
  options?: { value: string; label: string }[];
}
export default function Select(props: SelectProps) {
  const [error, setError] = useState<any>(props.error);

  const id = useId();

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  const inputProps = {
    ...props,
    size: undefined,
  };

  return (
    <div
      className={cn(
        "relative bg-neutral-100 cursor-text flex flex-col rounded-lg px-3 py-2 font-light text-neutral-700  ",
        error ? "border-red-500 text-red-500" : "",
        props.className
      )}
    >
      {props.label && (
        <label
          htmlFor={id}
          className={`blokay-label active ${props.size || "md"}`}
        >
          {props.label}
        </label>
      )}
      <select
        {...inputProps}
        id={id}
        onChange={(e) => {
          props.onChange && props.onChange(e.target.value);
          if (error) {
            setError(null);
          }
        }}
        onBlur={() => {
          props.onBlur && props.onBlur();
        }}
        onFocus={() => {
          props.onFocus && props.onFocus();
        }}
        value={props.value}
        className={`bg-transparent py-1 w-full outline-none  ${
          props.size || "md"
        } ${error ? "error" : ""}  `}
      >
        {!!props.children && props.children}

        {props?.options &&
          props.options?.length > 0 &&
          props.options.map((option: any, index: number) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>

      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
