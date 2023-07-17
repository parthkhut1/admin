import axios from "../../../axios";
import querystring from "query-string";

export const CATEGORY_URL =
  "/course-categories";

// CREATE =>  POST: add a new category to the server
export function createCategory(category) {
  delete category["id"];
  return axios.post(`${CATEGORY_URL}`, category);
}

// READ
export function getAllCategories() {
  return axios.get(CATEGORY_URL);
}

export function getCategoryById(categoryId) {
  //category contain a category fields that fetched from DB
  return axios.get(`${CATEGORY_URL}/${categoryId}`);
}

// Method from server should return QueryResultsModel(items: any[], totalsCount: number)
// items => filtered/sorted result
export function findCategories(queryParams) {
  const { pageNumber, pageSize, sortField, sortOrder, filter } = queryParams;
  const qp = {
    page: pageNumber,
    per_page: pageSize,
    sort: `-${sortField}`,
  };

  const qs = querystring.stringify(qp);
  return axios.get(`${CATEGORY_URL}?${qs}`);
}

// UPDATE => PUT: update the category on the server
export function updateCategory(category) {
  return axios.put(`${CATEGORY_URL}/${category.id}`, category);
}

// UPDATE Status
export function updateStatusForCategories(ids, status) {
  return axios.post(`${CATEGORY_URL}/updateStatusForcategories`, {
    ids,
    status,
  });
}

// DELETE => delete the category from the server
export function deleteCategory(categoryId) {
  return axios.delete(`${CATEGORY_URL}/${categoryId}`);
}

// DELETE Customers by ids
export function deleteCategories(ids) {
  return axios.post(`${CATEGORY_URL}/deletecategories`, { ids });
}

export function getChilds(parentId) {
  return axios.get(`${CATEGORY_URL}/${parentId}`);
}

export function getTreeChild(categoryId) {
  //category contain a category fields that fetched from DB
  return axios.get(`${CATEGORY_URL}/${categoryId}`);
}
