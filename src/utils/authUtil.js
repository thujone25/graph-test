import { CREDENTIALS } from "@/constants/credentials";

export const isAuthenticated = () => {
  return !!localStorage.getItem("app_auth_token");
};

export const setAuthToken = (token) => {
  localStorage.setItem("app_auth_token", token);
};

export const Logout = () => {
  localStorage.removeItem("app_auth_token");
};

export const getAuthToken = () => {
  return localStorage.getItem("app_auth_token");
};

export const authenticate = (creds) => {
  if (
    creds.email === CREDENTIALS.EMAIL &&
    creds.password === CREDENTIALS.PASSWORD
  ) {
    const token = "imagineItIsAnAuthToken";
    setAuthToken(token);
    return { success: true };
  } else {
    return { error: "Credentials are not valid" };
  }
};
