import axios from "../../../axios";
import querystring from "query-string";

export const TICKETS_URL = "/tickets";
export const MESSAGE_URL = "/ticket-messages";

// CREATE =>  POST: add a new ticket to the server
export function createTicket(ticket) {
  return axios.post(`${TICKETS_URL}`, ticket);
}

// READ
export function getAllTickets() {
  return axios.get(TICKETS_URL);
}

export function getTicketById(ticketId) {
  //ticket contain a ticket fields that fetched from DB
  return axios.get(`${TICKETS_URL}/${ticketId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findTickets(queryParams) {
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
  const qs = querystring.stringify(qp);

  if (
    (queryParams && queryParams.filter && !queryParams.filter["type"]) ||
    queryParams.filter["type"] == "" ||
    queryParams.filter["type"] == "open-tickets"
  )
    return axios.get(`${TICKETS_URL}/open-tickets?${qs}`);

  if (
    queryParams &&
    queryParams.filter &&
    queryParams.filter["type"] == "close-tickets"
  )
    return axios.get(`${TICKETS_URL}/close-tickets?${qs}`);

  if (
    queryParams &&
    queryParams.filter &&
    queryParams.filter["type"] == "trashed"
  )
    return axios.get(`${TICKETS_URL}/trashed?${qs}`);

  if (queryParams && queryParams.filter && queryParams.filter["type"] == "all")
    return axios.get(`${TICKETS_URL}?${qs}`);
}

// UPDATE => PUT: update the ticket on the server
export function updateTicket(ticket) {
  return axios.put(`${TICKETS_URL}/${ticket.id}`, ticket);
}

// UPDATE Status
export function updateStatusForTickets(ids, status) {
  return axios.post(`${TICKETS_URL}/updateStatusForTickets`, {
    ids,
    status,
  });
}

// DELETE => delete the ticket from the server
export function deleteTicket(ticketId) {
  return axios.delete(`${TICKETS_URL}/${ticketId}`);
}

// DELETE Customers by ids
export function deleteTickets(ids) {
  return axios.post(`${TICKETS_URL}/deleteTickets`, { ids });
}
export function changeTicketState(ticketId, state) {
  if (state) return axios.put(`${TICKETS_URL}/${ticketId}/close`);
  else return axios.put(`${TICKETS_URL}/${ticketId}/open`);
}

export function findTeacher(inputSearch) {
  const qs = querystring.stringify({
    search: inputSearch,
    per_page: 0,
  });

  return axios.get(`/users?${qs}`);
}

export function findCategories() {
  return axios.get(`${TICKETS_URL}/categories`);
}

export function findPriorities() {
  return axios.get(`${TICKETS_URL}/priorities`);
}

export function fetchMessages(ticketId, page = 1) {
  return axios.get(`${TICKETS_URL}/${ticketId}/messages?sort=-id&page=${page}`);
}

export function sendMessage(data) {
  return axios.post(`${MESSAGE_URL}`, data);
}

export function editMessage(messageId, data) {
  return axios.put(`${MESSAGE_URL}/${messageId}`, data);
}

export function deleteMessage(messageId) {
  return axios.delete(`${MESSAGE_URL}/${messageId}`);
}
