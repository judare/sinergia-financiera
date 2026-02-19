"use client";
import React, { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { githubGist as theme } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { Check, Copy, FileIcon } from "lucide-react";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("html", xml);

interface SyntaxHighlightProps {
  lang: string;
  code: string;
  copy?: boolean;
  download?: any;
  fileName?: string;
  className?: string;
}
export default function SyntaxHighlight(props: SyntaxHighlightProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={
        "bg-white overflow-x-auto scrollable-div  font-light  text-sm    overflow-hidden rounded-lg border-white/10 border "
      }
    >
      {props.fileName && (
        <div className=" border-b border-black/10 text-sm px-3 py-1.5 flex items-center gap-2 text-neutral-400">
          <FileIcon className="size-4" />
          <span> {props.fileName}</span>
        </div>
      )}

      <div className={" group relative pt-3"}>
        <div className="absolute right-3 top-3 transition-all duration-100 gap-1 flex opacity-0 group-hover:opacity-100">
          {props.copy && (
            <button
              onClick={() => {
                if (window.navigator?.clipboard) {
                  window.navigator.clipboard.writeText(props.code);
                }
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              className="bg-neutral-100 hover:bg-neutral-300 text-neutral-700 rounded-lg px-2 py-1 "
            >
              {copied && <Check className="size-5 text-lime-700" />}
              {!copied && <Copy className="size-5 " />}
            </button>
          )}
        </div>

        <div className={" scrollable-div select-text  " + props.className}>
          <SyntaxHighlighter
            language={props.lang}
            style={theme}
            wrapLines={true}
            lineProps={{
              style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
            }}
          >
            {props.code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
