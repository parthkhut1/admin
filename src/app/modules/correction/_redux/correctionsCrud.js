import axios from "../../../axios";
import querystring from "query-string";

export const CORRECTION_URL = "/manual-corrections";
export const BASED_URL = "";

// CREATE =>  POST: add a new correction to the server
export function createCorrection(correction) {
  return axios.post(`${CORRECTION_URL}`, correction);
}

// READ
export function getAllCorrections() {
  return axios.get(CORRECTION_URL);
}

export function getCorrectionById(correctionId) {
  //correction contain a correction fields that fetched from DB
  return axios.get(`${BASED_URL}/answers/${correctionId}`);
}

export function getQuestionById(questionId) {
  //correction contain a correction fields that fetched from DB
  return axios.get(`${BASED_URL}/questions/${questionId}`);
}

export function getUserAnswerById(answerId) {
  //correction contain a correction fields that fetched from DB
  return axios.get(`${BASED_URL}/answers/${answerId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCorrections(queryParams) {
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

  if (queryParams && queryParams.filter && queryParams.filter["question_type"])
    qp["question_type"] = queryParams.filter["question_type"];
  if (queryParams && queryParams.filter && queryParams.filter["is_uncorrected"])
    qp["manually_uncorrected"] = queryParams.filter["is_uncorrected"];

  const qs = querystring.stringify(qp);
  return axios.get(`${BASED_URL}/answers?${qs}`);
}

// UPDATE => PUT: update the correction on the server
export function updateCorrection(correction) {
  return axios.put(`${CORRECTION_URL}/${correction.id}`, correction);
}

// UPDATE Status
export function updateStatusForCorrections(ids, status) {
  return axios.post(`${CORRECTION_URL}/updateStatusForCorrections`, {
    ids,
    status,
  });
}

// DELETE => delete the correction from the server
export function deleteCorrection(correctionId) {
  return axios.delete(`${CORRECTION_URL}/${correctionId}`);
}

// DELETE Customers by ids
export function deleteCorrections(ids) {
  return axios.post(`${CORRECTION_URL}/deleteCorrections`, { ids });
}

export function findTeacher(inputSearch) {
  const qs = querystring.stringify({
    role: "teacher",
    search: inputSearch,
  });

  return axios.get(`/users?${qs}`);
}
