import { postRequest } from "./_base";

export const executeQuery = async function (
  workspaceId: string,
  datasourceId: string,
  sql: string
) {
  let data = {
    workspaceId,
    datasourceId,
    sql,
  };
  let result = await postRequest("datasources/execute", data);
  return result.data;
};

export const fetchDatasource = async function (
  workspaceId: string,
  datasourceId: string
) {
  let data = {
    workspaceId,
    datasourceId,
  };

  let result = await postRequest("datasources/get", data);
  return result.data;
};

export const syncDatasource = async function (
  workspaceId: string,
  datasourceId: string
) {
  let result = await postRequest("datasources/sync", {
    workspaceId,
    datasourceId,
  });
  return result.data;
};

export const fetchDatasources = async function (workspaceId: string) {
  let data = {
    workspaceId,
  };

  let result = await postRequest("datasources/list", data);
  return result.data;
};

export const fetchUpdateDatasources = async function (data = {}) {
  let result = await postRequest("datasources/update", data);
  return result.data;
};

export const fetchCreateDatasource = async function (data = {}) {
  let result = await postRequest("datasources/create", data);
  return result.data;
};

export const fetchDeleteDatasources = async function (data = {}) {
  let result = await postRequest("datasources/delete", data);
  return result.data;
};

export const authorizeDatasource = async function (data = {}) {
  let result = await postRequest("datasources/authorize", data);
  return result.data;
};
