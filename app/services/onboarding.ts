import { postRequest } from "./_base";

export const fetchOnboardingList = async function () {
  let result = await postRequest("onboarding/list", {});
  return result.data.OnboardingProcesses;
};

export const createApi = async function (data: any) {
  let result = await postRequest("onboarding/create", data);
  return result.data;
};
