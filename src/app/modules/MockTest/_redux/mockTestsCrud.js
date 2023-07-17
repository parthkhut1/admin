import axios from "../../../axios";
import querystring from "query-string";

export const MOCK_TEST_URL = "/mocks";

// CREATE =>  POST: add a new mockTest to the server
export function createMockTest(mockTest) {
  return axios.post(`${MOCK_TEST_URL}`, mockTest);
}
export function createMockTestRandomly(mockTest) {
  const newMockTest = {
    name: mockTest.name,
    durations: mockTest.durations,
    valid_till: mockTest.valid_till,
    types: mockTest.types
  };
  return axios.post(`${MOCK_TEST_URL}/generate`, newMockTest);
}

// READ
export function getAllMockTests() {
  return axios.get(MOCK_TEST_URL);
}

export function getMockTestById(mockTestId) {
  return axios.get(`${MOCK_TEST_URL}/${mockTestId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findMockTests(queryParams) {
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

  if (queryParams && queryParams.filter && queryParams.filter["title"])
    qp["search"] = queryParams.filter["title"];

  if (queryParams && queryParams.filter && queryParams.filter["tag"]) {
    const qs = querystring.stringify(qp);
    return axios.get(`/tags/${queryParams.filter["tag"]}/mocks?${qs}`);
  }
  const qs = querystring.stringify(qp);
  return axios.get(`${MOCK_TEST_URL}?${qs}`);
}

// UPDATE => PUT: update the mockTest on the server
export function updateMockTest(mockTest) {
  return axios.put(`${MOCK_TEST_URL}/${mockTest.id}`, mockTest);
}

// UPDATE Status
export function updateStatusForMockTests(ids, status) {
  return axios.post(`${MOCK_TEST_URL}/updateStatusForMockTests`, {
    ids,
    status
  });
}

// DELETE => delete the mockTest from the server
export function deleteMockTest(mockTestId) {
  return axios.delete(`${MOCK_TEST_URL}/${mockTestId}`);
}

// DELETE mockTests by ids
export function deleteMockTests(mockTestId, questions) {
  return axios.post(`${MOCK_TEST_URL}/${mockTestId}/questions`, {
    _method: "DELETE",
    questions
  });
}

const setReportCounter = (isExamQu) => {
  if (isExamQu === "1") return 1;
  else if (isExamQu === "0") return `${0},${0}`;
  else return 0;
};
// you are my reasone to go on
export function applyFilter(queryParams) {
  if (queryParams.tag) return getTags(queryParams);

  const qp = {
    "filter[title]": queryParams?.question_title,
    "filter[question_type]": queryParams?.question_type,
    "filter[difficulty]": queryParams.difficulty,
    "filter[is_free]": queryParams.is_free,
    "filter[is_for_mock]": +queryParams.is_for_mock,
    // "filter[report_counter]": +queryParams?.isExamQu == 0 ? 0 : `${0},${0}`,
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

export function addQuestionsToMockTest(mockTestId, questions) {
  return axios.post(`${MOCK_TEST_URL}/${mockTestId}/questions`, {
    questions
  });
}

export function getTags(queryParams) {
  const qp = {
    per_page: queryParams.per_page,
    page: queryParams.page
  };
  const qs = querystring.stringify(qp);
  return axios.get(`/tags/${queryParams.tag}/questions?${qs}`);
}

export function getSkillsQuestions(mockTestId) {
  return axios.get(`/mocks/${mockTestId}/questions?per_page=1000`);
}

export function togglePublishState(mockTestId) {
  return axios.put(`${MOCK_TEST_URL}/${mockTestId}/publish`);
}

export function sortMockTestQuestions(mockTestId, questionId, destinationId) {
  return axios.put(
    `${MOCK_TEST_URL}/${mockTestId}/questions/${questionId}?sort=${destinationId}`
  );
}

export function removeQuestion(mockTestId, questionId) {
  return axios.delete(`${MOCK_TEST_URL}/${mockTestId}/questions/${questionId}`);
}
