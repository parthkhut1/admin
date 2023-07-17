import axios from "../../../axios";
import querystring from "query-string";

export const TUTORIALS_URL = "/post-categories";
export const POSTS_URL = "/posts";

// CREATE =>  POST: add a new tutorial to the server
export function createTutorial(tutorial) {
  return axios.post(`${TUTORIALS_URL}`, { name: tutorial });
}

export function createPost(post) {
  return axios.post(`${POSTS_URL}`, post);
}

// READ
export function getAllTutorials() {
  return axios.get(TUTORIALS_URL);
}

export function getTutorialById(tutorialId) {
  //tutorial contain a tutorial fields that fetched from DB
  return axios.get(`${TUTORIALS_URL}/${tutorialId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findTutorials(queryParams) {
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
  return axios.get(`${TUTORIALS_URL}?${qs}`);
}

export function fetchTutorialPosts(tutorialId) {
  const qp = {
    page: 1,
    per_page: 1000,
  };
  const qs = querystring.stringify(qp);
  return axios.get(`${TUTORIALS_URL}/${tutorialId}/posts?${qs}`);
}

// UPDATE => PUT: update the tutorial on the server
export function updateTutorial(tutorial) {
  return axios.put(`${TUTORIALS_URL}/${tutorial.id}`, tutorial);
}

export function updatePost(post) {
  return axios.put(`${POSTS_URL}/${post.id}`, post);
}

// UPDATE Status
export function updateStatusForTutorials(ids, status) {
  return axios.post(`${TUTORIALS_URL}/updateStatusForTutorials`, {
    ids,
    status,
  });
}

// DELETE => delete the tutorial from the server
export function deleteTutorial(tutorialId) {
  return axios.delete(`${TUTORIALS_URL}/${tutorialId}`);
}

// DELETE => delete the tutorial from the server
export function deletePost(postId) {
  return axios.delete(`${POSTS_URL}/${postId}`);
}

// DELETE Customers by ids
export function deleteTutorials(ids) {
  return axios.post(`${TUTORIALS_URL}/deleteTutorials`, { ids });
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
export function getTags(tagName, model) {
  return axios.get(`/tags/${tagName}/${model}`);
}
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
    per_page: 1000,
  };
  qp["filter[without_tags]"] = "knowledge-tests";
  const qs = querystring.stringify(qp);
  return axios.get(`/questions?${qs}`);
}
