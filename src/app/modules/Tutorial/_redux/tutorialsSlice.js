import { createSlice } from "@reduxjs/toolkit";

const initialTutorialsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  entities: null,
  tutorialForEdit: undefined,
  lastError: null,
  posts: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const tutorialsSlice = createSlice({
  name: "tutorials",
  initialState: initialTutorialsState,
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
    // gettutorialById
    tutorialFetched: (state, action) => {
      state.actionsLoading = false;
      state.tutorialForEdit = action.payload.tutorialForEdit;
      state.error = null;
    },
    // findtutorials
    tutorialsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },

    // findtutorials
    postsFetched: (state, action) => {
      const { posts } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.posts = posts;
    },

    // createtutorial
    tutorialCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.tutorial);
    },
    // createtutorial
    postCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      if (action.payload.post.is_featured == 0)
        state.posts.push(action.payload.post);
    },

    // createtutorial
    postsReset: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.posts = null;
    },

    // updatetutorial
    tutorialUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.tutorial.id) {
          return action.payload.tutorial;
        }
        return entity;
      });
    },

    // updatetutorial
    postUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.posts = state.posts?.map((entity) => {
        if (entity.id === action.payload.post.id) {
          return action.payload.post;
        }
        return entity;
      });
    },

    // deletetutorial
    tutorialDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },

    postDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.posts = state.posts.filter((el) => el.id !== action.payload.id);
    },

    // deletetutorials
    tutorialsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // tutorialsUpdateState
    tutorialsStatusUpdated: (state, action) => {
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
