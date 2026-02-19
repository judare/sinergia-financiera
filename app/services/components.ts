import { postRequest } from "./_base";

export const fetchComponents = async function (
  workspaceId: string,
  viewId: string
) {
  let data = {
    workspaceId,
    viewId,
  };
  let result = await postRequest("components/list", data);
  return result.data;
};

export const fetchUpdateComponent = async function (form = {}) {
  let result = await postRequest("components/update", form);
  return result.data;
};

export const fetchCreateComponent = async function (form = {}) {
  let result = await postRequest("components/create", form);
  return result.data;
};

export const fetchDeleteComponent = async function (form = {}) {
  let result = await postRequest("components/delete", form);
  return result.data;
};

export const fetchCompile = async function (form = {}) {
  let result = await postRequest("components/compile", form);
  return result.data;
};
