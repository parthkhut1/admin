export const UserStatusCssClasses = ["danger", "success", "info", ""];
export const UserStatusTitles = ["Suspended", "Active", "Pending", ""];
export const UserTypeCssClasses = ["success", "primary", ""];
export const UserTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id",  order: "desc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "50", value: 50 },
  { text: "10", value: 10 },
];
export const initialFilter = {
  filter: {
    email: "",
    roles:""
  },
  sortOrder: "desc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10
};
