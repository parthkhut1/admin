import { createSlice } from "@reduxjs/toolkit";

const initialScopesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  entities: null,
  scopeForEdit: undefined,
  lastError: null,
  scopeBookingList: null,

  totalCountOfFilteredQuestions: 0,
  filteredQuestions: [],
  currentPageQuestions: 0,

  totalCountOfFilteredMocks: 0,
  filteredMocks: [],
  currentPageMocks: 0,

  totalCountOfFilteredSessions: 0,
  filteredSessions: [],
  currentPageSessions: 0,

  totalCountOfFilteredCourses: 0,
  filteredCourses: [],
  currentPageCourses: 0,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const scopesSlice = createSlice({
  name: "scopes",
  initialState: initialScopesState,
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
    // getscopeById
    scopeFetched: (state, action) => {
      state.actionsLoading = false;
      state.scopeForEdit = action.payload.scopeForEdit;
      state.error = null;
    },
    // findscopes
    scopesFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // findscopes
    scopeBookingListFetched: (state, action) => {
      const { entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.scopeBookingList = entities;
    },

    // createscope
    scopeCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.scope);
    },
    // updatescope
    scopeUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.scope.id) {
          return action.payload.scope;
        }
        return entity;
      });
    },
    // deletescope
    scopeDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletescopes
    scopesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // scopesUpdateState
    scopesStatusUpdated: (state, action) => {
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
    ///////////////////////////
    filteredQuestionsFetched: (state, action) => {
      const { totalCount, entities, current_page } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.filteredQuestions = [...entities];
      state.totalCountOfFilteredQuestions = totalCount;
      state.currentPageQuestions = current_page;
    },

    resetFilteredQuestionsFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.filteredQuestions = [];
      state.totalCountOfFilteredQuestions = 0;
      state.currentPageQuestions = 0;
    },
    filteredMocksFetched: (state, action) => {
      const { totalCount, entities, current_page } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.filteredMocks = [...entities];
      state.totalCountOfFilteredMocks = totalCount;
      state.currentPageMocks = current_page;
    },

    resetFilteredMocksFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.filteredMocks = [];
      state.totalCountOfFilteredMocks = 0;
      state.currentPageMocks = 0;
    },

    // findmockTests
    filteredSessionsFetched: (state, action) => {
      const { totalCount, entities, current_page } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.filteredSessions = [...entities];
      state.totalCountOfFilteredSessions = totalCount;
      state.currentPageSessions = current_page;
    },

    resetFilteredSessionsFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.filteredSessions = [];
      state.totalCountOfFilteredSessions = 0;
      state.currentPageSessions = 0;
    },

    filteredCoursesFetched: (state, action) => {
      const { totalCount, entities, current_page } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.filteredCourses = [...entities];
      state.totalCountOfFilteredCourses = totalCount;
      state.currentPageCourses = current_page;
      
    },

    resetFilteredCoursesFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.filteredCourses = [];
      state.totalCountOfFilteredCourses = 0;
      state.currentPageCourses = 0;
    },
  },
});
