import { createSlice } from "@reduxjs/toolkit";
import cloneDeep from "lodash/cloneDeep";

const initialCategoriesState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  // entities: null,
  entities: [{ id: 1, name: "Student Dashboard" }],
  categoryForEdit: undefined,
  lastError: null,

  notificationPost: null,
  bannerPost: null,
  videosPost: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const categoriesSlice = createSlice({
  name: "studentDashboard",
  initialState: initialCategoriesState,
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
    // getcategoryById
    categoryFetched: (state, action) => {
      state.actionsLoading = false;
      state.packageForEdit = action.payload.packageForEdit;
      state.error = null;
    },

    // findcategories
    categoriesFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      // state.entities = entities;
      // state.totalCount = totalCount;
    },

    categoriesFetchPosts: (state, action) => {
      const { data, type } = action.payload;
      state.listLoading = false;
      state.error = null;
      switch (type) {
        case "notification":
          state.notificationPost = data;
          break;
        case "banner":
          state.bannerPost = data;
          break;
        case "videos":
          state.videosPost = data;
          break;
      }
    },

    //////////////////////////
    // createcategory
    createPostLocaly: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.videosPost.unshift(action.payload.post);
    },
    // createcategory
    updatePostLocaly: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.videosPost = state.videosPost.map((entity) => {
        if (entity.id === action.payload.post.id) {
          return action.payload.post;
        }
        return entity;
      });
    },

    // createcategory
    deletePostLocaly: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.videosPost = state.videosPost.filter(
        (el) => el.id !== action.payload.id
      );
    },

    /////////////////

    // createcategory
    categoryCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.category);
    },
    // updatecategory
    categoryUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.category.id) {
          return action.payload.category;
        }
        return entity;
      });
    },
    // deletecategory
    categoryDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletecategories
    categoriesDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },

    // categoriesUpdateState
    categoriesStatusUpdated: (state, action) => {
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
