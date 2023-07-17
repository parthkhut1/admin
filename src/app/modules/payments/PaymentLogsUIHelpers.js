export const PaymentStatusCssClasses = ["danger", "success", "info", ""];
export const PaymentStatusTitles = ["Suspended", "Active", "Pending", ""];
export const PaymentTypeCssClasses = ["success", "primary", ""];
export const PaymentTypeTitles = ["Business", "Individual", ""];
export const defaultSorted = [{ dataField: "id", order: "desc" }];
export const sizePerPageList = [
  { text: "3", value: 3 },
  { text: "10", value: 10 },
  { text: "30", value: 30 },
  { text: "50", value: 50 },
  { text: "100", value: 100 }
];
export const initialFilter = {
  filter: {},
  sortOrder: "desc", // asc||desc
  sortField: "id",
  pageNumber: 1,
  pageSize: 10
};
