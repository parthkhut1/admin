import { createSlice } from "@reduxjs/toolkit";

const initialNotificationsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  totalUnreadCount: 0,
  entities: null,
  unreadEntities: null,
  notificationForEdit: undefined,
  lastError: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialNotificationsState,
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
    // getNotificationById
    notificationFetched: (state, action) => {
      state.actionsLoading = false;
      state.notificationForEdit = action.payload.notificationForEdit;
      state.error = null;
    },
    // findNotifications
    notificationsFetched: (state, action) => {
      const { totalCount, entities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
    },
    // findUnreadNotifications
    unreadNotificationsFetched: (state, action) => {
      const { totalUnreadCount, unreadEntities } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.unreadEntities = unreadEntities;
      state.totalUnreadCount = totalUnreadCount;
    },
    // createNotification
    notificationCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.notification);
    },
    // update Notification
    notificationUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.notification.id) {
          return action.payload.notification;
        }
        return entity;
      });
    },
    // deleteNotification
    notificationDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deleteNotification
    notificationsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // notificationsUpdateState
    notificationsStatusUpdated: (state, action) => {
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
