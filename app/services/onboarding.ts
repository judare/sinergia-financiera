import { postRequest } from "./_base";

export const fetchOnboardingList = async function () {
  let result = await postRequest("onboarding/list", {});
  return result.data.OnboardingProcesses;
};
