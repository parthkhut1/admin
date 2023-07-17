import { createSlice } from "@reduxjs/toolkit";

const initialUsersState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage: 10,
  currentPage: 1,
  entities: null,
  userForEdit: undefined,
  lastError: null,
  userPackagesList: [],
  userPackagesPage: 0,
  statistics: null,
  history: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const usersSlice = createSlice({
  name: "students",
  initialState: initialUsersState,
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
    // getUserById
    userFetched: (state, action) => {
      state.actionsLoading = false;
      state.userForEdit = action.payload.userForEdit;
      state.error = null;
    },

    statisticsFetched: (state, action) => {
      state.actionsLoading = false;
      state.statistics = action.payload.statistics;
      state.error = null;
    },

    historyFetched: (state, action) => {
      state.actionsLoading = false;
      state.history = action.payload.history;
      state.error = null;
    },

    // findUsers
    usersFetched: (state, action) => {
      const { totalCount, entities, perPage, currentPage } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // findSessions
    userPackagesListFetched: (state, action) => {
      const { entities, totalPage } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.userPackagesList = entities;
      state.userPackagesPage = totalPage;
    },
    removePackageFromUserPackagesList: (state, action) => {
      const { packageId } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.userPackagesList = state.userPackagesList?.filter(i => i.id != packageId)
    },
    // createUser
    userCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.user);
    },
    // updateUser
    userUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.user.id) {
          return action.payload.user;
        }
        return entity;
      });
    },
    // deleteUser
    userDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deleteUsers
    usersDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // usersUpdateState
    usersStatusUpdated: (state, action) => {
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
    // Gest login
    guestLogin: (state, action) => {
      state.actionsLoading = false;
      state.guestLogin = action.payload.history;
      state.error = null;
    },

  },
});
