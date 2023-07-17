import { createSlice } from "@reduxjs/toolkit";

const initialCouponsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  entities: null,
  couponForEdit: undefined,
  lastError: null,

  totalCountOfFilteredUsers: 0,
  filteredUsers: [],
  currentPageUsers: 0,

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

  totalCountOfFilteredPackages: 0,
  filteredPackages: [],
  currentPagePackages: 0,

  scopes: [],
  scope: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const couponsSlice = createSlice({
  name: "coupons",
  initialState: initialCouponsState,
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
    // getCouponById
    couponFetched: (state, action) => {
      state.actionsLoading = false;
      state.couponForEdit = action.payload.couponForEdit;
      state.error = null;
    },
    scopeFetched: (state, action) => {
      state.actionsLoading = false;
      state.couponForEdit = {
        ...state.couponForEdit,
        scope: action.payload.couponForEdit,
      };
      state.error = null;
    },
    addUsersToCoupon: (state, action) => {
      state.actionsLoading = false;
      state.couponForEdit = {...state.couponForEdit,users: action.payload.users};
      state.error = null;
    },
    
    filteredUsersFetched: (state, action) => {
      const { totalCount, entities, current_page } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.filteredUsers = [...entities];
      state.totalCountOfFilteredUsers = totalCount;
      state.currentPageUsers = current_page;
    },

    resetFilteredUsersFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.filteredUsers = [];
      state.totalCountOfFilteredUsers = 0;
      state.currentPageUsers = 0;
    },

    // findCoupons
    couponsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
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
      state.couponForEdit = {
        ...state.couponForEdit,
        billable_type: action.payload.scope.billable_type,
      };
      state.error = null;
    },
    // createCoupon
    couponCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.coupon);
    },
    // updateCoupon
    couponUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.coupon.id) {
          return action.payload.coupon;
        }
        return entity;
      });
    },
    // deleteCoupon
    couponDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deleteCoupons
    couponsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // couponsUpdateState
    couponsStatusUpdated: (state, action) => {
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


    filteredPackagesFetched: (state, action) => {
      const { totalCount, entities, current_page } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.filteredPackages = [...entities];
      state.totalCountOfFilteredPackages = totalCount;
      state.currentPagePackages = current_page;
    },

    resetFilteredPackagesFetched: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.filteredPackages = [];
      state.totalCountOfFilteredPackages = 0;
      state.currentPagePackages = 0;
    },

    
    resetScopeFetched: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.scope = null;
    },
  },
});
