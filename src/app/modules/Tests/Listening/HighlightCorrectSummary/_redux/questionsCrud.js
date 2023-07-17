import axios from "../../../../../axios";
import querystring from "query-string";

export const QUESTIONS_URL = "/questions";

// CREATE =>  POST: add a new question to the server

export function createQuestion(question) {
  delete question["id"];
  return axios.post(`${QUESTIONS_URL}`, question.question);
}

export function createAnswer(answer) {
  return axios.post(`/acceptable-answers`, answer);
}

export function getAcceptableAnswer(questionId) {
  return axios.get(`${QUESTIONS_URL}/${questionId}/acceptable-answers`);
}

// READ
export function getAllQuestions() {
  return axios.get(QUESTIONS_URL);
}

export function getQuestionById(questionId) {
  return axios.get(`${QUESTIONS_URL}/${questionId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findQuestions(queryParams) {
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
    qp["filter[title]"] = queryParams.filter["email"];

  qp["filter[question_type]"] = "HighlightCorrectSummary";
  if (queryParams && queryParams.filter && queryParams.filter["tag"]) {
    const qs = querystring.stringify(qp);
    return axios.get(`/tags/${queryParams.filter["tag"]}/questions?${qs}`);
  }

  const qs = querystring.stringify(qp);
  return axios.get(`${QUESTIONS_URL}?${qs}`);
}

// UPDATE => PUT: update the question on the server
export function updateQuestion(question) {
  return axios.post(`${QUESTIONS_URL}/${question.id}`, question.question);
}

export function updateAnswer(answerId, answer) {
  return axios.put(`/acceptable-answers/${answerId}`, answer);
}

// UPDATE Status
export function updateStatusForQuestions(ids, status) {
  return axios.post(`${QUESTIONS_URL}/updateStatusForQuestions`, {
    ids,
    status
  });
}

// DELETE => delete the question from the server
export function deleteQuestion(questionId) {
  return axios.delete(`${QUESTIONS_URL}/${questionId}`);
}

// DELETE Questions by ids
export function deleteQuestions(ids) {
  return axios.delete(`${QUESTIONS_URL}/${ids.join(",")}`);
}
// READ Mock Tests List
export function getMockTestsList() {
  return axios.get(`/mocks`);
}

// POST => add Question To Mock Test
export function addQuestionToMockTest(entity) {
  return axios.post(`/mocks/${entity.mock}/questions/${entity.id}`);
}

export function getGeo() {
  return axios.get(`/geo/default`);
}

export function setExamQuestion(examQu) {
  return axios.post(`/question-reports`, examQu);
}

export function updateExamQuestion(examQuId, examQu) {
  return axios.put(`/question-reports/${examQuId}`, examQu);
}
