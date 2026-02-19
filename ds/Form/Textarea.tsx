"use client";
import { useId, useRef, useLayoutEffect, useState } from "react";
import { Maximize2 } from "lucide-react";
import DS from "design-system";
import { cn } from "@/lib/utils";

export type TextareaProps = {
  [x: string]: any;
  label?: string;
  value: string;
  placeholder?: string;
  error?: string | null;
  size?: "sm" | "md";
};
export default function Textarea({
  label,
  value,
  error = null,
  ...extraProps
}: TextareaProps) {
  const id = useId();
  const modalRef = useRef<any>(null);
  const [isOver, setIsOver] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const inputProps = {
    ...extraProps,
    size: undefined,
  };
  const adjutHeight = () => {
    setTimeout(() => {
      if (textAreaRef.current) {
        const el = textAreaRef.current;
        if (el.scrollHeight === 0) return;
        if (el.scrollHeight === el.clientHeight) return;
        el.style.height = "auto"; // reset primero
        el.style.height = el.scrollHeight + "px";
      }
    }, 100);
  };
  useLayoutEffect(() => {
    adjutHeight();
  }, [value]); // cuando cambia el contenido, recalcula

  return (
    <div
      className={cn(
        "relative bg-neutral-100 cursor-text flex flex-col rounded-lg px-3 py-2 h-32 text-neutral-700 ",
        extraProps.className,
      )}
      onMouseOver={() => setIsOver(true)}
      onMouseOut={() => setIsOver(false)}
    >
      <label htmlFor={id} className={`text-xs font-medium active pb-2 `}>
        {label}
      </label>
      <textarea
        {...inputProps}
        id={id}
        onChange={(e) => {
          extraProps.onChange && extraProps.onChange(e.target.value);
        }}
        onBlur={() => {
          extraProps.onBlur && extraProps.onBlur();
        }}
        onFocus={() => {
          extraProps.onFocus && extraProps.onFocus();
        }}
        value={value}
        className={`bg-transparent flex-1 text-sm outline-none w-full h-full resize-none font-light ${
          isOver ? "" : "overflow-hidden"
        }`}
      />

      <div>
        <div
          className={`w-8 rounded-md flex items-center justify-center  text-neutral-500 hover:bg-neutral-200 px-2 py-1 cursor-default ${
            isOver ? "opacity-100" : "opacity-0"
          }  `}
          onClick={() => modalRef.current.showModal()}
        >
          <Maximize2 className="size-4" />
        </div>
      </div>

      <DS.Modal title={label} size="md" ref={modalRef}>
        <textarea
          ref={textAreaRef}
          autoFocus={true}
          onFocus={adjutHeight}
          className="w-full outline-none font-light resize-none"
          value={value}
          onChange={(e) => {
            extraProps.onChange && extraProps.onChange(e.target.value);
          }}
        />
      </DS.Modal>
    </div>
  );
}
