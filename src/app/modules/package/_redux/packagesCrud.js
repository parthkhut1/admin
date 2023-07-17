import axios from "../../../axios";
import querystring from "query-string";

export const PACKAGES_URL = "/packages";
export const SCOPES_URL = "/scopes";

// CREATE =>  POST: add a new package to the server
export function createPackage(dynamicPackage) {
  delete dynamicPackage["id"];
  return axios.post(`${PACKAGES_URL}`, dynamicPackage);
}

export function createScopes(packagee) {
  // const apiCalls = ["questions", "mocks", "sessions", "courses", "tags"].map(
  const apiCalls = ["questions", "mocks", "sessions", "courses"].map((i) => {
    const data = {
      name: `${packagee.name}_${i}`,
      billable_type: `${i !== "tags" ? i : ""}`
    };
    if (i !== "tags") data["billables"] = packagee[i];
    else data["billables"] = [];
    if (i == "tags") data["tags"] = packagee[i];
    else data["tags"] = [];
    return axios.post(SCOPES_URL, data);
  });
  return axios.all(apiCalls);
}

export function createScope(packagee) {
  const data = {
    name: `${packagee.name}_mocks`,
    billable_type: "mocks",
    billables: packagee["mocks"],
    tags: []
  };
  return axios.post(`${SCOPES_URL}`, data);
}
export function getScopesById(scopeIds = []) {
  const apiCalls = scopeIds.map((id) =>
    axios.get(`${SCOPES_URL}/${id}?detailed=true`)
  );

  return axios.all(apiCalls);
}

// READ
export function getAllPackages() {
  return axios.get(PACKAGES_URL);
}

export function getPackageById(id) {
  //package contain a package fields that fetched from DB
  return axios.get(`${PACKAGES_URL}/${id}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findPackages(queryParams) {
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
  return axios.get(`${PACKAGES_URL}?${qs}`);
}

// UPDATE => PUT: update the package on the server
export function updatePackage(dynamicPackage) {
  return axios.put(`${PACKAGES_URL}/${dynamicPackage.id}`, dynamicPackage);
}

export function updatePackageTags(dynamicPackageId, tagId) {
  return axios.post(`${PACKAGES_URL}/${dynamicPackageId}/tags/${tagId}`);
}
export function updatePackagelimitations(dynamicPackageId, type, tagId) {
  return axios.post(`${PACKAGES_URL}/${dynamicPackageId}/${type}/${tagId}`);
}

export function deletePackageTags(dynamicPackageId, tagId) {
  return axios.delete(`${PACKAGES_URL}/${dynamicPackageId}/tags/${tagId}`);
}

export function deletePackagelimitations(dynamicPackageId, type, tagId) {
  return axios.delete(`${PACKAGES_URL}/${dynamicPackageId}/${type}/${tagId}`);
}

// UPDATE Status
export function updateStatusForPackages(ids, status) {
  return axios.post(`${PACKAGES_URL}/updateStatusForpackages`, {
    ids,
    status
  });
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
    page: queryParams.page
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
    page: queryParams.page
  };
  const qs = querystring.stringify(qp);
  return axios.get(`/sessions?${qs}`);
}

export function applyFilterOnMockTest(queryParams) {
  if (queryParams.tag) return getTags(queryParams.tag, "mocks");
  const qp = {
    "filter[name]": queryParams?.name,
    valid: queryParams.valid_till,
    per_page: queryParams.per_page,
    page: queryParams.page
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
    page: queryParams.page
  };

  const qs = querystring.stringify(qp);
  return axios.get(`/courses?${qs}`);
}
export function getTags(tagName, model) {
  return axios.get(`/tags/${tagName}/${model}`);
}
// DELETE => delete the package from the server
export function deletePackage(packageId) {
  return axios.delete(`${PACKAGES_URL}/${packageId}`);
}

// DELETE Customers by ids
export function deletePackages(ids) {
  return axios.post(`${PACKAGES_URL}/deletePackages`, { ids });
}

export function findTags(inputSearch) {
  return axios.get(`/tags?filter[name]=${inputSearch}`);
}

export function findTeacher() {
  return axios.get(`/users?role=teacher`);
}

export function fetchScopes() {
  return axios.get(`/scopes?per_page=1000`);
}

export function getScopeById(id) {
  //package contain a package fields that fetched from DB
  return axios.get(`/scopes/${id}`);
}

///////////
export function addTags(scopeId, tags) {
  return axios.post(`${SCOPES_URL}/${scopeId}/tags`, { _method: "PUT", tags });
}
export function deleteTags(scopeId, tags) {
  return axios.post(`${SCOPES_URL}/${scopeId}/tags`, {
    _method: "DELETE",
    tags
  });
}
export function addBills(scopeId, billables) {
  return axios.post(`${SCOPES_URL}/${scopeId}/billables`, {
    _method: "PUT",
    billables
  });
}
export function deleteBills(scopeId, billables) {
  return axios.post(`${SCOPES_URL}/${scopeId}/billables`, {
    _method: "DELETE",
    billables
  });
}
///////////////////

export function getAssistantsScopes() {
  return axios.get(`/scopes?filter[billable_type]=assistants`);
}

export function getUserPackagesList(packageId, page) {
  return axios.get(`/packages/${packageId}/purchased?page=${page}`);
}

export function getExportList(packageId) {
  return axios({
    url: `/packages/${packageId}/export`,
    method: "GET",
    responseType: "blob" // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "file.xlsx");
    document.body.appendChild(link);
    link.click();
  });
}
