export const ReportStatusCssClasses = ["danger", "success", "info", ""];
export const ReportStatusTitles = ["Suspended", "Active", "Pending", ""];
export const ReportTypeCssClasses = ["success", "primary", ""];
export const ReportTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "exam_date",  order: "desc" }];
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
  sortField: "exam_date",
  pageNumber: 1,
  pageSize: 10,
};