export const MockTestStatusCssClasses = ["danger", "success", "info", ""];
export const MockTestStatusTitles = ["Suspended", "Active", "Pending", ""];
export const MockTestTypeCssClasses = ["success", "primary", ""];
export const MockTestTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id",  order: "desc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "10", value: 10 },
  { text: "30", value: 30 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
];
export const initialFilter = {
  filter: {
    title: "",
  },
  sortOrder: "desc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10,
};
