"use client";

export const VERSION = "1.0.1";

let staticPath = "https://static.blokay.com/talkia";
let baseUrl = `https://talkia.co`;
let url = `${baseUrl}/api/`;

if (typeof process !== "undefined") {
  staticPath = "";
  baseUrl = process.env.NEXT_PUBLIC_URL || "";
  url = process.env.NEXT_PUBLIC_API || "";
}
export const BASE_URL = baseUrl;

export const API = url;

export const STATIC_PATH = staticPath;
