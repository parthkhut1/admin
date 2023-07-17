import axios from "../../../app/axios";

export const STATISTICS_URL = "/statistics";
export const USERS_URL = "/users";

export function fetchStatistics() {
  return axios.get(
    `${STATISTICS_URL}/provider/list?blocks=most-practiced-users,most-reported-exam-questions,most-reported-difficult-questions,most-practiced-questions,most-practiced-mock-tests,most-purchased-subscription-types,most-purchased-packages`
  );
}

export function fetchOnlineUsers() {
  return axios.get(`${STATISTICS_URL}/onlines`);
}

export function setDeviceToken(device_token) {
  return axios.put(`${USERS_URL}/set-device-token`, { device_token });
}
