import { createSlice } from "@reduxjs/toolkit";

const initialPackagesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage: 10,
  currentPage: 1,
  entities: null,
  packageForEdit: undefined,
  lastError: null,

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

  scopes: [],
  scope: null,

  assistantsScopes: [],

  usersPackagesList: [],
  usersPackagesPage: 0,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const packagesSlice = createSlice({
  name: "packages",
  initialState: initialPackagesState,
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
    // getpackageById
    packageFetched: (state, action) => {
      state.actionsLoading = false;
      state.packageForEdit = action.payload.packageForEdit;
      state.error = null;
    },
    scopesFetched: (state, action) => {
      const { entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.scopes = entities;
    },
    scopeFetched: (state, action) => {
      state.actionsLoading = false;
      state.scope = action.payload.scope;
      state.error = null;
    },
    // findpackages
    packagesFetched: (state, action) => {
      const { totalCount, entities, perPage, currentPage } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },

    assistantsScopesFetched: (state, action) => {
      const { entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.assistantsScopes = entities;
    },
    // findmockTests
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

    // findmockTests
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
    // createpackage
    packageCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.package);
    },
    // updatepackage
    packageUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.package.id) {
          return action.payload.package;
        }
        return entity;
      });
    },
    // deletepackage
    packageDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletepackages
    packagesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // packagesUpdateState
    packagesStatusUpdated: (state, action) => {
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
    usersPackagesListFetched: (state, action) => {
      const { entities } = action.payload;
      // const { entities,totalPage } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.usersPackagesList = entities;
      // state.usersPackagesPage = totalPage;
    },

    resetUsersPackagesListFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.usersPackagesList = [];
    },
  },
});
