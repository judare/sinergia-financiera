import { postRequest } from "./_base";

export const fetchSignIn = async function (service: string, form: any) {
  let data = {
    ...form,
    service,
  };

  let result = await postRequest("auth/login", data);

  if (result?.data?.redirect) {
    window.location.href = result.data.redirect;
  }
  return result.data;
};

export const fetchRegister = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("auth/register", data);

  return result.data;
};

export const fetchForgotPassword = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("auth/forgot", data);
  return result.data;
};

export const fetchRecoverPassword = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("auth/recoverpassword", data);
  return result.data;
};
