import axios from "../../../axios";

export const LOGIN_URL = "api/v1/auth/login";
export const REGISTER_URL = "api/v1/auth/register";
export const REQUEST_PASSWORD_URL = "api/v1/auth/forgot";
export const ME_URL = "api/me";

export function login(email, password) {
  return axios.post("/auth/login", {
    email,
    password
  });
}

export function reset(email, token, password) {
  return axios.post("/auth/reset", {
    email,
    verification_code: token,
    password
  });
}

export function verifyEmail(email, token) {
  return axios.post("/auth/verify", {
    email,
    verification_code: token
  });
}

export function update(name, password, timezone) {
  const data = {};
  if (name) data["name"] = name;
  if (password) data["password"] = password;
  if (timezone) data["timezone"] = timezone;
  return axios.put("/users/profile", data);
}

export function register(email, fullname, username, password) {
  return axios.post("/auth/register", {
    email,
    fullname,
    username,
    password
  });
}

export function requestPassword(email) {
  return axios.post("/auth/forgot", { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get("https://api.ptea.edubenchmark.com/backend/v1/");
}

export function updatePassword(current_password, new_password) {
  return axios.put("/users/password", {
    current_password,
    new_password
  });
}
