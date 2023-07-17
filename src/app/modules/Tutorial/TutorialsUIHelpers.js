export const TutorialStatusCssClasses = ["danger", "success", "info", ""];
export const TutorialStatusTitles = ["Suspended", "Active", "Pending", ""];
export const TutorialTypeCssClasses = ["success", "primary", ""];
export const TutorialTypeTitles = ["Business", "Individual", ""];
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
    email: "",
    type: "",
  },
  sortOrder: "desc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10,
};