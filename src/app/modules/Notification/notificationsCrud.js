import axios from "../../../app/axios";
export const NOTIFICATIONS_URL = "/activities";



export function getAllNotifications() {
  return axios.get(NOTIFICATIONS_URL);
}

export function getUnreadNotifications() {
    return axios.get(`${NOTIFICATIONS_URL}/unreads`);
  }

export function markAsRead(notifId) {
  return axios.put(`${NOTIFICATIONS_URL}/${notifId}`);
}


export function markAllAsRead() {
  return axios.put(`${NOTIFICATIONS_URL}/mark-all`);
}
