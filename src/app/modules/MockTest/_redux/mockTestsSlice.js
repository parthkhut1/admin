import { createSlice } from "@reduxjs/toolkit";

const initialMockTestsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,

  entities: null,
  mockTestForEdit: undefined,
  lastError: null,
  
  totalCountOfFilteredQuestions: 0,
  filteredQuestions: [],
  currentPageQuestions: 0,

  questions:[],
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const mockTestsSlice = createSlice({
  name: "mockTests",
  initialState: initialMockTestsState,
  reducers: {
    catchError: (state, action) => {
      console.log("action", action);
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
    // getmockTestById
    mockTestFetched: (state, action) => {
      state.actionsLoading = false;
      state.mockTestForEdit = action.payload.mockTestForEdit;
      state.error = null;
    },
    // findmockTests
    mockTestsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },

    questionsFetched: (state, action) => {
      const { entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.questions = entities;
    },

    // findmockTests
    filteredQuestionsFetched: (state, action) => {
      const { totalCount, entities, current_page, per_page } = action.payload;
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
    // createmockTest
    mockTestCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.mockTest);
    },
    // updatemockTest
    mockTestUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.mockTest.id) {
          return action.payload.mockTest;
        }
        return entity;
      });
    },
    // deletemockTest
    mockTestDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletemockTests
    mockTestsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // mockTestsUpdateState
    mockTestsStatusUpdated: (state, action) => {
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
