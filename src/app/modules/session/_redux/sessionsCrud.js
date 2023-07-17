import axios from "../../../axios";
import querystring from "query-string";

export const SESSIONS_URL = "/sessions";

// CREATE =>  POST: add a new session to the server
export function createSession(session) {
  delete session["id"];
  return axios.post(`${SESSIONS_URL}`, session);
}

// READ
export function getAllSessions() {
  return axios.get(SESSIONS_URL);
}

// UPDATE => PUT: update the session on the server
export function cancelSession(sessionId) {
  return axios.put(`${SESSIONS_URL}/${sessionId}/cancel`);
}

export function getSessionById(sessionId) {
  //session contain a session fields that fetched from DB
  return axios.get(`${SESSIONS_URL}/${sessionId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findSessions(queryParams) {
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
    qp["search"] = queryParams.filter["email"];

  if (queryParams && queryParams.filter && queryParams.filter["tag"]) {
    const qs = querystring.stringify(qp);
    return axios.get(`/tags/${queryParams.filter["tag"]}/sessions?${qs}`);
  }

  const qs = querystring.stringify(qp);

  if (queryParams && queryParams.isTeacher) {
    return axios.get(`${SESSIONS_URL}/teacher-index?${qs}`);
  }
  return axios.get(`${SESSIONS_URL}?${qs}`);
}

// UPDATE => PUT: update the session on the server
export function updateSession(session) {
  return axios.put(`${SESSIONS_URL}/${session.id}`, session);
}

// UPDATE Status
export function updateStatusForSessions(ids, status) {
  return axios.post(`${SESSIONS_URL}/updateStatusForSessions`, {
    ids,
    status,
  });
}

// DELETE => delete the session from the server
export function deleteSession(sessionId) {
  return axios.post(`${SESSIONS_URL}/${sessionId}`, { _method: "DELETE" });
}

// DELETE Customers by ids
export function deleteSessions(ids) {
  return axios.post(`${SESSIONS_URL}/deleteSessions`, { ids });
}

export function findTeacher(inputSearch) {
  const qs = querystring.stringify({
    role: "teacher",
    search: inputSearch,
  });

  return axios.get(`/users?${qs}`);
}

export function getSessionBookingList(sessionId, page) {
  return axios.get(`/bookings?filter[session_id]=${sessionId}?page=${page}`);
}

export function findStudents(inputSearch) {
  const qs = querystring.stringify({
    search: inputSearch,
  });

  return axios.get(`/users/students?${qs}`);
}

export function deleteBooking(bookingId) {
  return axios.delete(`/bookings/${bookingId}`);
}

export function addBooking(data) {
  return axios.post(`/bookings`, data);
}

export function createTicket(data) {
  return axios.post(`/tickets`, data);
}

export function createTicketMessage(data) {
  return axios.post(`/ticket-messages`, data);
}
