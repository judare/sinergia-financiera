import { postRequest } from "./_base";

export const rollKey = async function (data: any) {
  let result = await postRequest("keys/roll", data);
  return result.data;
};

export const fetchKeys = async function (data: any) {
  let result = await postRequest("keys/list", data);
  return result.data;
};
