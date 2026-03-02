import { postRequest } from "./_base";

export const fetchOnboardingList = async function (data: any) {
  let result = await postRequest("onboarding/list", { ...data });
  return result.data.OnboardingProcesses;
};

export const fetchOnboarding = async function (processingCode: string) {
  let result = await postRequest("onboarding/get", { processingCode });
  return result.data.OnboardingProcess;
};

export const createApi = async function (data: any) {
  let result = await postRequest("onboarding/create", data);
  return result.data;
};

export const fetchAreas = async function () {
  let result = await postRequest("onboarding/areas", {});
  return result.data.Areas;
};

export const fetchCourses = async function () {
  let result = await postRequest("onboarding/courses", {});
  return result.data.Courses;
};

export const fetchOnboardingReport = async function () {
  let result = await postRequest("onboarding/report", {});
  return result.data;
};
