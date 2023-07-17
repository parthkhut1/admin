import axios from "../../../../axios";
import querystring from "query-string";

export const USERS_URL = "/users";

// CREATE =>  POST: add a new user to the server
export function createUser(user) {
  delete user["id"];
  return axios.post(`${USERS_URL}`, user);
}

// READ
export function getAllUsers() {
  return axios.get(USERS_URL);
}

export function getUserById(userId) {
  return axios.get(`${USERS_URL}/${userId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findUsers(queryParams) {
  console.log(queryParams);
  const qp = {};
  if (queryParams && queryParams.sortField) {
    if (queryParams?.sortOrder === "asc") {
      qp["sort"] = queryParams["sortField"];
    } else if (queryParams.sortOrder === "desc") {
      qp["sort"] = `-${queryParams["sortField"]}`;
    }
  }
  if (queryParams && queryParams.pageSize)
    qp["per_page"] = queryParams["pageSize"];

  if (queryParams && queryParams.pageNumber)
    qp["page"] = queryParams["pageNumber"];

  if (queryParams && queryParams.filter && queryParams.filter["email"])
    // qp["search"] = queryParams.filter["email"];
    qp["search"] = queryParams.filter["email"];

  if (queryParams && queryParams.filter && queryParams.filter["tag"]) {
    const qs = querystring.stringify(qp);
    return axios.get(`/tags/${queryParams.filter["tag"]}/users?${qs}`);
  }

  if (
    (queryParams &&
      queryParams.filter &&
      queryParams.filter["creationDateFrom"]) ||
    queryParams.filter["creationDateTo"]
  )
    qp["filter[created_at]"] = `${
      queryParams.filter["creationDateFrom"]
        ? queryParams.filter["creationDateFrom"]
        : ""
    },${
      queryParams.filter["creationDateTo"]
        ? queryParams.filter["creationDateTo"]
        : ""
    }`;

  if (queryParams && queryParams.filter && queryParams.filter["roles"])
    qp["role"] = queryParams.filter["roles"];
  const qs = querystring.stringify(qp);

  if (
    (queryParams && queryParams.filter && !queryParams.filter["roles"]) ||
    queryParams.filter["roles"] == "" ||
    queryParams.filter["roles"] == "all"
  )
    return axios.get(`${USERS_URL}/students?${qs}`);
  else return axios.get(`${USERS_URL}?${qs}`);
}

export function getTags(tagName) {
  return axios.get(`/tags/${tagName}/users`);
}

// UPDATE => PUT: update the user on the server
export function updateUser(user) {
  return axios.put(`${USERS_URL}/${user.id}`, user);
}

export function resetUserPassword(user) {
  return axios.put(`${USERS_URL}/${user.id}/reset-password`, {
    password: user.password
  });
}

export function activeAndDeactive(userId) {
  return axios.put(`${USERS_URL}/${userId}/deactivate`);
}

// UPDATE Status
export function updateStatusForUsers(ids, status) {
  return axios.post(`${USERS_URL}/updateStatusForUsers`, {
    ids,
    status
  });
}

// DELETE => delete the user from the server
export function deleteUser(userId) {
  return axios.delete(`${USERS_URL}/${userId}`);
}

// DELETE Users by ids
export function deleteUsers(ids) {
  return axios.post(`${USERS_URL}/deleteUsers`, { ids });
}

export function getUserPackagesList(userId, page) {
  return axios.get(`/users/${userId}/purchased-packages?page=${page}`);
}

export function assignPackage(data) {
  return axios.post(`/package-users`, {
    package_id: data.packageId,
    user_id: data.userId
  });
}

export function pay(payableId) {
  return axios.post(`/pay/${payableId}/nil`);
}

export function getUserStatistics(userId) {
  return axios.get(`/users/${userId}/quick-statistics`);
}

export function getLoginHistory(userId) {
  return axios.get(`/users/${userId}/list-logins`);
}

export function packageCancelation(packageId) {
  return axios.delete(`/package-users/${packageId}`);
}

export function guestLogin(body) {
  return axios.post(`/auth/guest-login`, body);
}