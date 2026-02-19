import { postRequest } from "./_base";

export const listCustomers = async function (data: any | null) {
  let result = await postRequest("customers/list", data);
  return result.data;
};

export const fetchCustomer = async function (data: any | null) {
  let result = await postRequest("customers/get", data);
  return result.data;
};
