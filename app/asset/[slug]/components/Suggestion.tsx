"use client";
import { useState } from "react";
const Suggestion = ({ suggestion }: { suggestion: any }) => {
  const [done, setDone] = useState(false);
  return (
    <div
      className={`px-5 py-3 hover:bg-neutral-100 flex items-start gap-3 `}
      onClick={() => setDone(!done)}
    >
      <div className="rounded-full size-6 border border-neutral-300 shrink-0 mt-1 flex justify-center items-center">
        <div
          className={`bg-black size-4 rounded-full transition-opacity duration-100 ${done ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div>
        <div
          className={`text-base  ${done ? "line-through text-neutral-400" : "text-black"}`}
        >
          {suggestion.title}
        </div>
        <div
          className={`text-xs ${done ? "line-through text-neutral-400" : ""}`}
        >
          {suggestion.description}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
