import axios from "../../../axios";
import querystring from "query-string";

export const TAGS_URL = "/tags";

// CREATE =>  POST: add a new tag to the server
export function createTag(tag) {
  delete tag["id"];
  return axios.post(`${TAGS_URL}`, tag);
}

// READ
export function getAllTags() {
  return axios.get(TAGS_URL);
}

export function getTagById(tag) {
  //tag contain a tag fields that fetched from DB
  return axios.get(`${TAGS_URL}/${tag.id}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findTags(queryParams) {
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
  return axios.get(`${TAGS_URL}?${qs}`);
}

// UPDATE => PUT: update the tag on the server
export function updateTag(tag) {
  return axios.put(`${TAGS_URL}/${tag.id}`, tag);
}

// UPDATE Status
export function updateStatusForTags(ids, status) {
  return axios.post(`${TAGS_URL}/updateStatusForTags`, {
    ids,
    status,
  });
}

// DELETE => delete the tag from the server
export function deleteTag(tagId) {
  return axios.delete(`${TAGS_URL}/${tagId}`);
}

// DELETE Customers by ids
export function deleteTags(ids) {
  return axios.post(`${TAGS_URL}/deletetags`, { ids });
}

export function findTeacher(inputSearch) {
  const qs = querystring.stringify({
    role: "teacher",
    search: inputSearch,
  });

  return axios.get(`/users?${qs}`);
}
