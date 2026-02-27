import { postRequest, postMultimedia } from "./_base";

export const fetchUsers = async function () {
  let result = await postRequest("users/list", {});
  return result.data.Users;
};

export const fetchUser = async function (userId: number) {
  let data = { userId };
  let result = await postRequest("users/get", data);
  return result.data;
};

export const fetchAddUser = async function (data: any) {
  let result = await postRequest("users/add", data);
  return result.data;
};

export const fetchUpdateUser = async function (data: any) {
  let result = await postRequest("users/edit", data);
  return result.data;
};

export const fetchDeleteUser = async function (data: any) {
  let result = await postRequest("users/delete", data);
  return result.data;
};

export const updateBusiness = async function (data: any) {
  let result = await postRequest("users/updateBusiness", data);
  return result;
};

export const uploadAsset = async function (data: any) {
  let result = await postMultimedia("users/uploadAssets", data);
  return result;
};
