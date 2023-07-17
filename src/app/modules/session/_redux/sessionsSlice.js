import { createSlice } from "@reduxjs/toolkit";

const initialSessionsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  totalPages: 1,
  perPage:10,
  currentPage:1,
  entities: null,
  sessionForEdit: undefined,
  lastError: null,
  sessionBookingList: null,
  sessionBookingTotalPage: 0,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const sessionsSlice = createSlice({
  name: "sessions",
  initialState: initialSessionsState,
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
    // getSessionById
    sessionFetched: (state, action) => {
      state.actionsLoading = false;
      state.sessionForEdit = action.payload.sessionForEdit;
      state.error = null;
    },
    // findSessions
    sessionsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // findSessions
    sessionBookingListFetched: (state, action) => {
      const { entities , totalPage } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.sessionBookingList = entities;
      state.sessionBookingTotalPage = totalPage;
    },

    // createSession
    sessionCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.session);
    },
    // updateSession
    sessionUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.session.id) {
          return action.payload.session;
        }
        return entity;
      });
    },
    // deleteSession
    sessionDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deleteSessions
    sessionsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // sessionsUpdateState
    sessionsStatusUpdated: (state, action) => {
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
  },
});
