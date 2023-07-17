import axios from "../../../axios";
import querystring from "query-string";

export const SCOPES_URL = "/scopes";

// CREATE =>  POST: add a new scope to the server
export function createScope(scope) {
  delete scope["id"];
  return axios.post(`${SCOPES_URL}`, scope);
}

// READ
export function getAllScopes() {
  return axios.get(SCOPES_URL);
}

export function getScopeById(scopeId) {
  //scope contain a scope fields that fetched from DB
  return axios.get(`${SCOPES_URL}/${scopeId}?detailed=true`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findScopes(queryParams) {
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
    return axios.get(`/tags/${queryParams.filter["tag"]}/scopes?${qs}`);
  }
  const qs = querystring.stringify(qp);
  return axios.get(`${SCOPES_URL}?${qs}`);
}

// UPDATE => PUT: update the scope on the server
export function updateScope(scope) {
  return axios.put(`${SCOPES_URL}/${scope.id}`, scope);
}

// UPDATE Status
export function updateStatusForScopes(ids, status) {
  return axios.post(`${SCOPES_URL}/updateStatusForScopes`, {
    ids,
    status,
  });
}

// DELETE => delete the scope from the server
export function deleteScope(scopeId) {
  return axios.delete(`${SCOPES_URL}/${scopeId}`);
}

// DELETE Customers by ids
export function deleteScopes(ids) {
  return axios.post(`${SCOPES_URL}/deleteScopes`, { ids });
}

export function getScopeBookingList(scopeId) {
  return axios.get(`/bookings?filter[scope_id]=${scopeId}?per_page=1000`);
}

export function findStudents(inputSearch) {
  const qs = querystring.stringify({
    search: inputSearch,
  });

  return axios.get(`/users?${qs}`);
}

export function deleteBooking(bookingId) {
  return axios.delete(`/bookings/${bookingId}`);
}

export function addBooking(data) {
  return axios.post(`/bookings`, data);
}

///////////
export function addTags(scopeId, tags) {
  return axios.post(`${SCOPES_URL}/${scopeId}/tags`, { _method: "PUT", tags });
}
export function deleteTags(scopeId, tags) {
  return axios.post(`${SCOPES_URL}/${scopeId}/tags`, {
    _method: "DELETE",
    tags,
  });
}
export function addBills(scopeId, billables) {
  return axios.post(`${SCOPES_URL}/${scopeId}/billables`, {
    _method: "PUT",
    billables,
  });
}
export function deleteBills(scopeId, billables) {
  return axios.post(`${SCOPES_URL}/${scopeId}/billables`, {
    _method: "DELETE",
    billables,
  });
}

export function findTeacher(inputSearch) {
  const qs = querystring.stringify({
    role: "teacher",
    search: inputSearch,
  });

  return axios.get(`/users?${qs}`);
}

const setReportCounter = (isExamQu) => {
  if (isExamQu === "1") return 1;
  else if (isExamQu === "0") return `${0},${0}`;
  else return 0;
};
// you are my reasone to go on
export function applyFilterOnQuestion(queryParams) {
  if (queryParams.tag) return getTags(queryParams.tag, "questions");

  const qp = {
    search: queryParams?.question_title,
    "filter[question_type]": queryParams?.question_type,
    "filter[difficulty]": queryParams.difficulty,
    "filter[is_free]": queryParams.is_free,
    "filter[is_for_mock]": +queryParams.is_for_mock,
    // "filter[report_counter]": queryParams?.isExamQu == 1 ? 1 : `${0},${0}`,
    "filter[report_counter]": setReportCounter(queryParams?.isExamQu),
    "filter[created_at]": `${
      queryParams?.creationDate_from ? queryParams?.creationDate_from : ""
    },${queryParams?.creationDate_to ? queryParams?.creationDate_to : ""}`,
    per_page: queryParams.per_page,
    page: queryParams.page,
  };
  qp["filter[without_tags]"] = "knowledge-tests";
  const qs = querystring.stringify(qp);
  return axios.get(`/questions?${qs}`);
}

export function applyFilterOnSession(queryParams) {
  if (queryParams.tag) return getTags(queryParams.tag, "sessions");
  const qp = {
    "filter[name]": queryParams?.name,
    "filter[teacher_id]": queryParams.teacher_id,
    "filter[is_free]": queryParams.is_free,
    "filter[started_at]": queryParams.started_at,
    per_page: queryParams.per_page,
    page: queryParams.page,
  };
  const qs = querystring.stringify(qp);
  return axios.get(`/sessions?${qs}`);
}

export function applyFilterOnMockTest(queryParams) {
  if (queryParams.tag) return getTags(queryParams.tag, "mocks");
  console.log("queryParams", queryParams);
  const qp = {
    "filter[name]": queryParams?.name,
    valid: queryParams.valid_till,
    per_page: queryParams.per_page,
    page: queryParams.page,
  };

  const qs = querystring.stringify(qp);
  return axios.get(`/mocks?${qs}`);
}

export function applyFilterOnCourse(queryParams) {
  const qp = {
    "filter[title]": queryParams?.title,
    "filter[is_free]": queryParams.is_free,
    "filter[published_at]": queryParams.published_at,
    per_page: queryParams.per_page,
    page: queryParams.page,
  };

  const qs = querystring.stringify(qp);
  return axios.get(`/courses?${qs}`);
}

export function getTags(tagName, model) {
  return axios.get(`/tags/${tagName}/${model}`);
}
