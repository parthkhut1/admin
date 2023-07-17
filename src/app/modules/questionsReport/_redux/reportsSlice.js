import { createSlice } from "@reduxjs/toolkit";

const initialReportsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage: 10,
  currentPage: 1,
  entities: null,
  reportForEdit: undefined,
  lastError: null,

  question: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const reportsSlice = createSlice({
  name: "questionReports",
  initialState: initialReportsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // getreportById
    reportFetched: (state, action) => {
      state.actionsLoading = false;
      state.reportForEdit = action.payload.reportForEdit;
      state.error = null;
    },
    // findreports
    reportsFetched: (state, action) => {
      const { totalCount, entities, perPage, currentPage } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // createreport
    reportCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.report);
    },
    // updatereport
    reportUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.report.id) {
          return action.payload.report;
        }
        return entity;
      });
    },
    // deletereport
    reportDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletereports
    reportsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // reportsUpdateState
    reportsStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map((entity) => {
        if (ids.findIndex((id) => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    },
    questionFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.question = action.payload.question;
    },
  },
});
