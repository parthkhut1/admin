import axios from "../../../axios";
import querystring from "query-string";

export const REPORTS_URL = "/question-reports";

// CREATE =>  POST: add a new report to the server
export function createReport(report) {
  return axios.post(`${REPORTS_URL}`, report);
}

// READ
export function getAllReports() {
  return axios.get(REPORTS_URL);
}

export function getReportById(report) {
  //report contain a report fields that fetched from DB
  return axios.get(`${REPORTS_URL}/${report.id}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findReports(queryParams) {
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

  if (queryParams && queryParams.filter && queryParams.filter["country"])
    qp["filter[country]"] = queryParams.filter["country"];

  if (queryParams && queryParams.filter && queryParams.filter["city"])
    qp["filter[city]"] = queryParams.filter["city"];

  const qs = querystring.stringify(qp);
  return axios.get(`${REPORTS_URL}?${qs}`);
}

// UPDATE => PUT: update the report on the server
export function updateReport(report) {
  return axios.put(`${REPORTS_URL}/${report.id}`, report);
}

// UPDATE Status
export function updateStatusForReports(ids, status) {
  return axios.post(`${REPORTS_URL}/updateStatusForReports`, {
    ids,
    status,
  });
}

// DELETE => delete the report from the server
export function deleteReport(reportId) {
  return axios.delete(`${REPORTS_URL}/${reportId}`);
}

// DELETE Customers by ids
export function deleteReports(ids) {
  return axios.post(`${REPORTS_URL}/deleteReports`, { ids });
}

export function findTeacher(inputSearch) {
  const qs = querystring.stringify({
    role: "teacher",
    search: inputSearch,
  });

  return axios.get(`/users?${qs}`);
}

export function getQuestionById(questionId) {
  return axios.get(`/questions/${questionId}`);
}

export function getExportList() {
  return axios({
    url: `${REPORTS_URL}/export`,
    method: "GET",
    responseType: "blob", // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.xlsx");
    document.body.appendChild(link);
    link.click();
  });
}
