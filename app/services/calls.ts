import { postRequest } from "./_base";

export const listCalls = async function (data: any | null) {
  let result = await postRequest("voice/calls/list", data);
  return result.data;
};

export const getCall = async function (callId: string | null) {
  let data = {
    callId,
  };
  let result = await postRequest("voice/calls/get", data);
  return result.data;
};

export const createCall = async function (data: any) {
  let result = await postRequest("voice/calls/create", data);
  return result.data;
};

export const updateCall = async function (data: any) {
  let result = await postRequest("voice/calls/update", data);
  return result.data;
};

export const fetchCallDirect = async function (data: any) {
  let result = await postRequest("voice/calls/direct-agent", data, null, {
    credentials: undefined,
  });
  return result;
};

export const fetchCalificate = async function (data: any) {
  let result = await postRequest("voice/agents/calificate", data);
  return result.data;
};
