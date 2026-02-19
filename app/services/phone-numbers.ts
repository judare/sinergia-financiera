import { postRequest } from "./_base";

export const fetchPhoneNumbers = async function () {
  let result = await postRequest("voice/phone-numbers/list", {});
  return result.data;
};

export const deletePhoneNumber = async function (data: any) {
  let result = await postRequest("voice/phone-numbers/delete", data);
  return result.data;
};

export const addPhoneNumber = async function (data: any) {
  let result = await postRequest("voice/phone-numbers/add", data);
  return result.data;
};
