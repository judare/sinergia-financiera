"use client";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
// import DS from "design-system";
import { CheckCheck, X } from "lucide-react";
import FloatBox from "@/app/components/UI/FloatBox";

interface Props {
  children?: React.ReactNode;
  time?: number;
}
function ConfirmToast({ time = 10 }: Props, ref: any) {
  const [showing, setShowing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(time * 1000);
  const [id, setId] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const hide = () => {
    setShowing(false);
    setTimeLeft(time * 1000);
  };

  useEffect(() => {
    let framesPerSecond = 1000 / 24;
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          hide();
          clearInterval(interval);
          return 0;
        }
        return prevTime - framesPerSecond;
      });
    }, framesPerSecond);
    return () => clearInterval(interval);
  }, [id]);

  useImperativeHandle(ref, () => ({
    show: (message: string, type = "success") => {
      setMessage(message);
      setType(type);
      setId(Math.random());
      setTimeout(() => {
        setTimeLeft(time * 1000);
        setShowing(true);
      }, 100);
    },
    hide: () => {
      hide();
    },
  }));

  return (
    <FloatBox
      showing={showing}
      darkMode={true}
      className="right-5  -translate-x-0 left-auto "
    >
      <div
        className="absolute top-0 left-0 h-full bg-white/20 rounded-xl"
        style={{
          width: `${((time - timeLeft / 1000) / time) * 100}%`,
        }}
      ></div>
      <div className="py-2 px-5 flex items-center gap-5 z-10 relative justify-between text-white font-light">
        <div>
          {type == "success" && (
            <CheckCheck className="size-5 text-green-500" />
          )}
          {type == "error" && <X className="size-5 text-red-500" />}
        </div>
        <div className="shrink-0 text-sm">{message}</div>
      </div>
    </FloatBox>
  );
}

export default forwardRef(ConfirmToast);
