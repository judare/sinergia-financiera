import { postRequest } from "./_base";

export const addAgent = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("voice/agents/new", data);

  return result.data;
};

export const deleteAgent = async function (form: any) {
  let result = await postRequest("voice/agents/delete", form);
  return result.data;
};

export const fetchAgents = async function (workspaceId: string | null) {
  let data = {
    workspaceId,
  };
  let result = await postRequest("voice/agents/list", data);
  return result.data;
};

export const getAgent = async function (data: any) {
  let result = await postRequest("voice/agents/get", data);
  return result.data;
};

export const updateAgent = async function (data: any) {
  let result = await postRequest("voice/agents/update", data);
  return result.data;
};

export const fetchVoices = async function (data: any) {
  let result = await postRequest("voice/agents/voices", data);
  return result.data;
};
