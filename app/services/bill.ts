import { postRequest } from "./_base";

export const fetchUsage = async function (billId: any) {
  let data = {
    billId,
  };
  let result = await postRequest("bill/usage", data);
  return result.data;
};

export const fetchUsageCurrent = async function () {
  let data = {};
  let result = await postRequest("bill/usage/current", data);
  return result.data;
};

export const fetchUsageBlocks = async function (data: any) {
  let result = await postRequest("bill/usage/blocks", data);
  return result.data;
};

export const fetchBill = async function (billId: string) {
  let data = {
    billId,
  };
  let result = await postRequest("bill/get", data);
  return result.data.Bill;
};

export const fetchBills = async function () {
  let data = {};
  let result = await postRequest("bill/list", data);
  return result.data.Bills;
};

export const fetchPlans = async function () {
  let data = {};
  let result = await postRequest("bill/plans", data);
  return result.data.Plans;
};
