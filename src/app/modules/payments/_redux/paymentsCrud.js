import axios from "../../../axios";
import querystring from "query-string";

export const PAYMENTS_URL = "/payments";

// CREATE =>  POST: add a new payment to the server
export function createPayment(payment) {
  delete payment["id"];
  return axios.post(`${PAYMENTS_URL}`, payment);
}

// READ
export function getAllPayments() {
  return axios.get(PAYMENTS_URL);
}

export function getPaymentById(payment) {
  //payment contain a payment fields that fetched from DB
  return axios.get(`${PAYMENTS_URL}/${payment.id}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findPayments(queryParams) {
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
  return axios.get(`${PAYMENTS_URL}?${qs}`);
}

// UPDATE => PUT: update the payment on the server
export function updatePayment(payment) {
  return axios.put(`${PAYMENTS_URL}/${payment.id}`, payment);
}

// UPDATE Status
export function updateStatusForPayments(ids, status) {
  return axios.post(`${PAYMENTS_URL}/updateStatusForPayments`, {
    ids,
    status
  });
}

// DELETE => delete the payment from the server
export function deletePayment(paymentId) {
  return axios.delete(`${PAYMENTS_URL}/${paymentId}`);
}

// DELETE Customers by ids
export function deletePayments(ids) {
  return axios.post(`${PAYMENTS_URL}/deletePayments`, { ids });
}
