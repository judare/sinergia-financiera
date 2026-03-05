import { postRequest } from "./_base";

export const fetchAreas = async function () {
  const result = await postRequest("areas/list", {});
  return result.data.Areas;
};

export const fetchCreateArea = async function (data: any) {
  const result = await postRequest("areas/create", data);
  return result.data;
};

export const fetchUpdateArea = async function (data: any) {
  const result = await postRequest("areas/edit", data);
  return result.data;
};

export const fetchDeleteArea = async function (data: any) {
  const result = await postRequest("areas/delete", data);
  return result.data;
};
