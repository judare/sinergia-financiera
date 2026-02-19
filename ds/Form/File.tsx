"use client";
import React, { useState, useRef, useId } from "react";
import { FileText, Sheet, Upload } from "lucide-react";
import Loader from "../Loader/Index";
import { useApi } from "@/app/hooks/useApi";
import { uploadAsset } from "@/app/services/users";

type FileProps = {
  label?: string;
  preview?: string;
  classSelector?: string;
  endpoint?: string;
  size?: string;
  onError?: any;
  onDone?: any;
  onChangeFiles?: any;
};
export default function File({
  label,
  preview,
  classSelector,
  size = "md",
  onError,
  onDone,
  onChangeFiles,
}: FileProps) {
  const inputRef: any = useRef(null);
  const { loading, callApi } = useApi(uploadAsset);

  const [prev, setPrev] = useState("");
  const id = useId();

  const ext = (): string => {
    const file = prev || preview;
    return file ? file.split(".").pop() || "" : "";
  };
  const previewImage = (): string => {
    const file = prev || preview || "";

    if (["png", "jpeg", "jpg", "bmp", "webp"].includes(ext())) {
      return file;
    }
    return "";
  };

  const onChange = async () => {
    const list = inputRef.current.files;
    if (list.length > 0) {
      const formData = new FormData();
      formData.append("file", list[0]);

      try {
        let result = await callApi(formData);

        onDone && onDone(result);
        if (result.data.Resource) {
          setPrev(result.data.Resource.preview);
          onChangeFiles && onChangeFiles(result.data.Resource);
        }
      } catch (err) {
        onError && onError(err);
      }
    }
  };

  const renderImage = () => {
    if (loading) {
      return <Loader className="mx-auto px-3" size="sm" />;
    } else if (previewImage()) {
      return (
        <img
          src={previewImage()}
          alt="preview"
          className="rounded-lg mx-auto"
          style={{ width: "50px", height: "50px" }}
        />
      );
    } else if (ext() === "pdf") {
      return (
        <FileText className="h-10 text-neutral-800 dark:text-neutral-200" />
      );
    } else if (["csv", "xls", "xlsx"].includes(ext())) {
      return <Sheet className="h-10 text-neutral-800 dark:text-neutral-200" />;
    } else {
      return <Upload className="h-10 text-neutral-800 dark:text-neutral-200" />;
    }
  };

  return (
    <div
      className={`p-2 rounded-lg inline-block bg-neutral-100 dark:bg-white/5 dark:border-neutral-900 dark:hover:bg-black border-2 border-neutral-200 hover:bg-neutral-200 w-full  ${classSelector} ${size}`}
    >
      <input
        type="file"
        className="hidden"
        id={id + "file"}
        onChange={onChange}
        ref={inputRef}
      />

      <label
        htmlFor={id + "file"}
        className=" items-center gap-3 cursor-pointer flex"
      >
        <div className="prev">{renderImage()}</div>

        <div>
          {label ? (
            <div className="text-sm block py-1 text-neutral-800 dark:text-neutral-100 font-medium">
              {label}
            </div>
          ) : null}

          <div className="text-left font-light text-xs text-neutral-600 dark:text-neutral-300">
            <p className="md:hidden block">Click here to select a file</p>
            <p className="hidden md:block">Touch here to select.</p>
          </div>
        </div>
      </label>
    </div>
  );
}
