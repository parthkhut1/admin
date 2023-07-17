import axios from "../../../axios";
import querystring from "query-string";

export const COUPONS_URL = "/ease-coupons";
export const COUPONS_TAG_URL = "/tags";
export const SCOPES_URL = "/scopes";
export const USERS_URL = "/users";

// CREATE =>  POST: add a new coupon to the server
export function createCoupon(coupon) {
  return axios.post(`${COUPONS_URL}`, coupon);
}

// READ
export function getAllCoupons() {
  return axios.get(COUPONS_URL);
}

export function getCouponById(couponId) {
  return axios.get(`${COUPONS_URL}/${couponId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCoupons(queryParams) {
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

  if (queryParams && queryParams.filter && queryParams.filter["name"])
    qp["search"] = queryParams.filter["name"];

  const qs = querystring.stringify(qp);
  return axios.get(`${COUPONS_URL}?${qs}`);
}

export function findTags(inputSearch) {
  const qs = querystring.stringify({
    search: inputSearch,
  });

  return axios.get(`${COUPONS_TAG_URL}?${qs}`);
}

// UPDATE => PUT: update the coupon on the server
export function updateCoupon(coupon) {
  return axios.put(`${COUPONS_URL}/${coupon.id}`, coupon);
}

// UPDATE Status
export function updateStatusForCoupons(ids, status) {
  return axios.post(`${COUPONS_URL}/updateStatusForCoupons`, {
    ids,
    status,
  });
}

// DELETE => delete the coupon from the server
export function deleteCoupon(couponId) {
  return axios.delete(`${COUPONS_URL}/${couponId}`);
}

// DELETE Coupons by ids
export function deleteCoupons(ids) {
  return axios.post(`${COUPONS_URL}/deleteCoupons`, { ids });
}

export function fetchScopes() {
  return axios.get(`/scopes?per_page=1000`);
}

export function getScopeById(id) {
  //package contain a package fields that fetched from DB
  return axios.get(`/scopes/${id}?detailed=true`);
}
export function createScope(info) {
  const data = {
    name: `${info.name}_coupone`,
    billable_type: info.billable_type,
    billables: info["bills"],
    tags: [],
  };
  return axios.post(`${SCOPES_URL}`, data);
}

export function applyFilterOnUsers(queryParams) {
  if (queryParams.tag) return getTags(queryParams.tag, "users");
  console.log("queryParams", queryParams);
  const qp = {
    "filter[name]": queryParams?.name,
    per_page: queryParams.per_page,
    page: queryParams.page,
  };

  const qs = querystring.stringify(qp);
  return axios.get(`/users/students?${qs}`);
}

export function getTags(tagName, model) {
  return axios.get(`/tags/${tagName}/${model}`);
}

export function getUserById(id) {
  //package contain a package fields that fetched from DB
  return axios.get(`/users/${id}`);
}

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

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

export function applyFilterOnPackage(queryParams) {
  const qp = {
    // "filter[title]": queryParams?.title,
    // "filter[is_free]": queryParams.is_free,
    // "filter[published_at]": queryParams.published_at,
    per_page: queryParams.per_page,
    page: queryParams.page,
  };

  const qs = querystring.stringify(qp);
  return axios.get(`/packages?${qs}`);
}

// export function findTags(inputSearch) {
//   return axios.get(
//     `/tags?filter[name]=${inputSearch}`
//   );
// }

export function findTeacher() {
  return axios.get(`/users?role=teacher`);
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

export function fetchUsers(ids = []) {
  const apiCalls = ids?.map((i) => {
    return axios.get(`${USERS_URL}/${i}`);
  });
  return axios.all(apiCalls);
}
