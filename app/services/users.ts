import { postRequest, postFile, postMultimedia } from "./_base";

export const fetchUsers = async function () {
  let result = await postRequest("users/list", {});
  return result.data;
};

export const fetchBusiness = async function () {
  let result = await postRequest("users/business", {});
  return result.data.Business;
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

export const downloadUserLogs = async function (data: any) {
  let result = await postFile("users/downloadLogs", data);
  return result;
};

export const addCard = async function (data: any) {
  let result = await postRequest("users/saveCard", data);
  return result;
};

export const updateBusiness = async function (data: any) {
  let result = await postRequest("users/updateBusiness", data);
  return result;
};

export const sendFeedback = async function (data: any) {
  let result = await postRequest("users/sendFeedback", data);
  return result.data;
};

export const listPaymentMethods = async function (data: any) {
  let result = await postRequest("bill/payment-methods", data);
  return result;
};

export const removePaymentMethods = async function (data: any) {
  let result = await postRequest("bill/payment-methods/remove", data);
  return result;
};

export const makeDefaultPaymentMethods = async function (data: any) {
  let result = await postRequest("bill/payment-methods/make-default", data);
  return result;
};

export const fetchCountries = async function (data: any) {
  let result = await postRequest("users/countries", data);
  return result.data;
};

export const uploadAsset = async function (data: any) {
  let result = await postMultimedia("users/uploadAssets", data);
  return result;
};
