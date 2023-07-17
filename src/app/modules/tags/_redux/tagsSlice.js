import {createSlice} from "@reduxjs/toolkit";

const initialTagsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  entities: null,
  tagForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const tagsSlice = createSlice({
  name: "tags",
  initialState: initialTagsState,
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
    // gettagById
    tagFetched: (state, action) => {
      state.actionsLoading = false;
      state.tagForEdit = action.payload.tagForEdit;
      state.error = null;
    },
    // findtags
    tagsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // createtag
    tagCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.tag);
    },
    // updatetag
    tagUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity.id === action.payload.tag.id) {
          return action.payload.tag;
        }
        return entity;
      });
    },
    // deletetag
    tagDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(el => el.id !== action.payload.id);
    },
    // deletetags
    tagsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el.id)
      );
    },
    // tagsUpdateState
    tagsStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map(entity => {
        if (ids.findIndex(id => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    }
  }
});
