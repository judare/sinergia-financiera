"use client";
import { VERSION, API } from "./config";

export const getOS = () => {
  var userAgent = (window as any).navigator.userAgent,
    platform = (window as any).navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"],
    os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "iOS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (/Android/.test(userAgent)) {
    os = "Android";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }
  return os;
};

export const postRequest = async function (
  endpoint: string,
  data: any,
  user: any = null,
  extraOpts: any = { credentials: "include" }
) {
  let opts: any = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
      _version: VERSION,
      _channel: `${getOS()}`,
      _token: user?.token,
      publicKey: user?.publicKey,
    }),
  };

  if (extraOpts.credentials) {
    opts.credentials = extraOpts.credentials;
  }

  if (user) {
    opts.headers.Authorization = "Bearer " + user.token;
  }

  const rawResponse = await fetch(API + endpoint, opts);

  let content = null;
  if (extraOpts.blob) {
    content = await rawResponse.blob();
  } else if (extraOpts.stream) {
    return rawResponse;
  } else {
    content = await rawResponse.json();
  }

  if (rawResponse.status === 401) {
    throw content;
  }
  if (rawResponse.status !== 200) throw content;

  return content;
};

export const postMultimedia = async function (
  endpoint: string,
  form: any,
  user: any = null
) {
  let opts: any = {
    method: "POST",
    headers: {},
    body: form,
  };

  if (user) {
    opts.headers.Authorization = "Bearer " + user.token;
  }

  const rawResponse = await fetch(API + endpoint, opts);

  const content = await rawResponse.json();

  if (rawResponse.status != 200) throw content;
  return content;
};

export const postFile = async function (endpoint: string, data: any) {
  let opts: any = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
      _version: VERSION,
    }),
  };

  const rawResponse = await fetch(API + endpoint, opts);

  const content = await rawResponse.blob();

  if (rawResponse.status != 200) throw content;
  return content;
};
