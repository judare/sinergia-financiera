"use client";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalProps = {
  title?: string | null;
  position?: "top" | "center" | "bottom" | "top-left" | "right";
  bgColor?: string;
  classSection?: string | null;
  size?: "sm" | "md" | "lg" | "auto";
  children?: any;
  footer?: any;
  clickBack?: null | (() => void);
  onClose?: null | (() => void);
  onConfirmClose?: null | (() => void);
  darkMode?: boolean;
  classBody?: string;
};

const Modal = function (props: ModalProps, ref: any): any {
  const container: any =
    typeof window !== "undefined"
      ? document.getElementById("blokay") || document?.body
      : null;

  const {
    title = "",
    position = "center",
    classSection = null,
    size = "sm",
    children,
    footer,
    clickBack = null,
    onClose = null,
    onConfirmClose = null,
    darkMode = false,
    classBody,
  } = props;
  const [showing, setShowing] = useState(false);
  const [bgColor, setBackgroundColor] = useState(props.bgColor || "white");
  const [error, setError] = useState("");

  const showModal = () => {
    setShowing(true);
  };

  const tryClose = () => {
    if (onConfirmClose) {
      onConfirmClose && onConfirmClose();
    } else {
      hideModal();
    }
  };

  const hideModal = () => {
    onClose && onClose();
    setShowing(false);
    setError("");
  };

  const clear = () => {
    setError("");
  };

  const putError = (error: string) => {
    setError(error);
  };

  const changeColorModal = (color: string) => {
    setBackgroundColor(color);
  };

  useImperativeHandle(ref, () => ({
    tryClose,
    showModal,
    hideModal,
    clear,
    putError,
    changeColorModal,
    isShowing: () => showing,
  }));

  const positionClass = () => {
    if (position === "center") {
      return "justify-center items-center ";
    } else if (position === "top") {
      return "items-end justify-end";
    } else if (position === "top-left") {
      return "items-end justify-start";
    } else if (position === "bottom") {
      return "items-start justify-end";
    } else if (position === "right") {
      return "items-center justify-end";
    }
    return "";
  };

  const sizeClass = () => {
    if (size === "sm") {
      return "lg:w-96 w-full mx-3 ";
    } else if (size === "md") {
      return "lg:w-1/2 w-full mx-3 ";
    } else if (size === "lg") {
      return "lg:w-2/3 w-full mx-3 ";
    } else if (size === "auto") {
      return "lg:w-max-2/3 w-min-1/3 overflow-x-auto  mx-3 ";
    }
    return "";
  };

  useEffect(() => {
    function escFunction(event: any) {
      if (event.key === "Escape") {
        tryClose();
      }
    }
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [tryClose]);

  return container
    ? createPortal(
        <div>
          <AnimatePresence>
            {showing && (
              <div
                className={`blokay ${
                  darkMode && ""
                } fixed inset-0 flex ${positionClass()} backdrop-blur-sm  ${
                  darkMode ? "bg-black/70" : "bg-neutral-500/20"
                } z-[70]`}
                onMouseDown={() => {
                  tryClose();
                }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "dark:text-neutral-200  text-black  rounded-3xl border border-white/10 ",
                    sizeClass(),
                    size,
                    classSection,
                    bgColor == "white" ? "bg-white dark:bg-[#121316]" : "",
                  )}
                  style={{
                    backgroundColor: bgColor != "white" ? bgColor : "",
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {title && (
                    <div className="flex justify-between items-center border-b dark:border-neutral-800 border-neutral-200 py-4 px-4">
                      <div className="flex items-center justify-start gap-3 w-full">
                        <div
                          className="action-icon"
                          onClick={() => clickBack && clickBack()}
                          style={{ display: clickBack ? "block" : "none" }}
                        >
                          <svg viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                          </svg>
                        </div>
                        <h2 className="text-base md:text-base w-full">
                          {title}
                        </h2>
                      </div>
                      <div
                        className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-1 rounded-full cursor-pointer"
                        onClick={tryClose}
                      >
                        {position !== "bottom" && (
                          <X className="w-6 h-6 text-black dark:text-neutral-200" />
                        )}
                        {position === "bottom" && (
                          <ChevronDown className="w-6 h-6 text-black dark:text-neutral-200" />
                        )}
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className=" w-full  p-3 bg-red-600 items-center text-indigo-100 leading-none flex lg:inline-flex font-light">
                      <span className="mr-2 text-left flex-auto text-white">
                        {error}
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "py-5 px-4 overflow-y-auto scrollable-div ",
                      error ? "with-error" : "",
                      classBody,
                    )}
                    style={{
                      maxHeight: `calc(100vh - ${
                        (footer ? 100 : 0) + (title ? 80 : 0)
                      }px)`,

                      height: position == "right" ? "100%" : "auto",
                    }}
                  >
                    {showing && children}
                  </div>

                  {footer && (
                    <div className="pt-5 pb-3 px-4 border-t dark:border-neutral-800 border-neutral-200">
                      <div className="footer">{footer}</div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>,
        container,
      )
    : null;
};
export default forwardRef(Modal) as any;
