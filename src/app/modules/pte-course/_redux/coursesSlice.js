import { createSlice } from "@reduxjs/toolkit";

const initialCoursesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  entities: null,
  courseForEdit: undefined,
  lastError: null,
  courseBookingList: null,
  level0: [],
  level1: [],
  level2: [],

  totalCountOfFilteredQuestions: 0,
  filteredQuestions: [],
  currentPage: 0,
  questions: [],

  mainCatagories: [],
  subCatagories: [],
  subCatagorieslevel3: [],
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const coursesSlice = createSlice({
  name: "courses",
  initialState: initialCoursesState,
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
    // getcourseById
    courseFetched: (state, action) => {
      state.actionsLoading = false;
      state.courseForEdit = action.payload.courseForEdit;
      state.error = null;
    },
    // findcourses
    coursesFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // findcourses
    courseBookingListFetched: (state, action) => {
      const { entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.courseBookingList = entities;
    },

    categoriesFetchChilds: (state, action) => {
      const { entities, levelIndex } = action.payload;
      state.listLoading = false;
      state.error = null;
      switch (levelIndex) {
        case 0:
          state.level0 = entities;
          break;
        case 1:
          state.level1 = entities;
          break;
        case 2:
          state.level2 = entities;
          break;
      }
    },
    resetLevel1: (state, action) => {
      state.level1 = [];
    },
    resetLevel2: (state, action) => {
      state.level2 = [];
    },

    // createcourse
    courseCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.course);
    },

    // findmockTests
    filteredQuestionsFetched: (state, action) => {
      const { totalCount, entities, current_page, per_page } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.filteredQuestions = [...entities];
      state.totalCountOfFilteredQuestions = totalCount;
      state.currentPage = current_page;
    },

    resetFilteredQuestionsFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.filteredQuestions = [];
      state.totalCountOfFilteredQuestions = 0;
      state.currentPage = 0;
    },
    // updatecourse
    courseUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.course.id) {
          return action.payload.course;
        }
        return entity;
      });
    },
    // deletecourse
    courseDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletecourses
    coursesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // coursesUpdateState
    coursesStatusUpdated: (state, action) => {
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

    setMainCatagories: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.mainCatagories = action.payload.categories;
    },
    setSubCatagories: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.subCatagories = action.payload.categories;
    },
    setSubCatagoriesLevel3: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.subCatagorieslevel3 = action.payload.categories;
    },
    
  },
});
