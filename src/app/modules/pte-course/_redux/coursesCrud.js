import axios from "../../../axios";
import querystring from "query-string";

export const COURSES_URL = "/courses";
export const SCOPES_URL = "/scopes";
export const CATEGORY_URL =
  "/course-categories";

// CREATE =>  POST: add a new course to the server
export function createCourse(course) {
  delete course["id"];
  return axios.post(`${COURSES_URL}`, course);
}

// READ
export function getAllCourses() {
  return axios.get(COURSES_URL);
}

export function getCourseById(courseId) {
  //course contain a course fields that fetched from DB
  return axios.get(`${COURSES_URL}/${courseId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCourses(queryParams) {
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
    return axios.get(
      `/tags/${queryParams.filter["tag"]}/courses?${qs}`
    );
  }
  

  if (queryParams && queryParams.filter && queryParams.filter["categoryId"])
    qp["filter[course_category_id]"] = queryParams.filter["categoryId"];

  const qs = querystring.stringify(qp);
  return axios.get(`${COURSES_URL}?${qs}`);
}

// UPDATE => PUT: update the course on the server
export function updateCourse(course) {
  return axios.put(`${COURSES_URL}/${course.id}`, course);
}

// UPDATE Status
export function updateStatusForCourses(ids, status) {
  return axios.post(`${COURSES_URL}/updateStatusForCourses`, {
    ids,
    status,
  });
}

// DELETE => delete the course from the server
export function deleteCourse(courseId) {
  return axios.delete(`${COURSES_URL}/${courseId}`);
}

// DELETE Customers by ids
export function deleteCourses(ids) {
  return axios.post(`${COURSES_URL}/deleteCourses`, { ids });
}

export function getChilds(parentId) {
  return axios.get(`${CATEGORY_URL}/${parentId}`);
}

const setReportCounter = (isExamQu) => {
  if (isExamQu === "1") return 1;
  else if (isExamQu === "0") return `${0},${0}`;
  else return 0;
};
export function applyFilter(queryParams) {
  if (queryParams.tag) return getTags(queryParams);

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

export function applyFilterOnKnowledgeTest(queryParams) {
  if (queryParams.tag) return getTags(queryParams);

  const qp = {
    "filter[with_tags]" : "knowledge-tests",
    search: queryParams?.question_title,
    "filter[question_type]": queryParams?.question_type,
    // "filter[difficulty]": queryParams.difficulty,
    // "filter[is_free]": queryParams.is_free,
    // "filter[is_for_mock]": +queryParams.is_for_mock,
    // // "filter[report_counter]": queryParams?.isExamQu == 1 ? 1 : `${0},${0}`,
    // "filter[report_counter]": setReportCounter(queryParams?.isExamQu),
    // "filter[created_at]": `${
    //   queryParams?.creationDate_from ? queryParams?.creationDate_from : ""
    // },${queryParams?.creationDate_to ? queryParams?.creationDate_to : ""}`,
    per_page: queryParams.per_page,
    page: queryParams.page,
  };
  const qs = querystring.stringify(qp);
  return axios.get(`/questions?${qs}`);
}


export function getTags(queryParams) {
  const qp = {
    per_page: queryParams.per_page,
    page: queryParams.page,
  };
  const qs = querystring.stringify(qp);
  return axios.get(
    `/tags/${queryParams.tag}/questions?${qs}`
  );
}

export function addQuestionsToMockTest(mockTestId, questions) {
  return axios.post(`${COURSES_URL}/${mockTestId}/questions`, {
    questions,
  });
}

// DELETE mockTests by ids

export function addQuestions(courseId, questions) {
  return axios.post(`${COURSES_URL}/${courseId}/questions`, {
    questions,
  });
}
export function deleteQuestions(courseId, questions) {
  return axios.post(`${COURSES_URL}/${courseId}/questions`, {
    _method: "DELETE",
    questions,
  });
}

export function getTreeChild(categoryId) {
  //category contain a category fields that fetched from DB
  return axios.get(`${CATEGORY_URL}/${categoryId}`);
}
