import * as requestFromServer from "./notificationsCrud";
import { notificationsSlice } from "./notificationsSlice";
import SnackbarUtils from "./../../notistack";

const { actions } = notificationsSlice;


export const fetchAllNotifications = () => (dispatch) => {
  return requestFromServer
    .getAllNotifications()
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total: totalCount },
          },
        },
      } = response.data;
      dispatch(actions.notificationsFetched({ totalCount, entities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};

export const fetchUnreadNotifications = () => (dispatch) => {
  return requestFromServer
    .getUnreadNotifications()
    .then((response) => {
      const {
        payload: {
          data: unreadEntities,
          meta: {
            pagination: { total: totalUnreadCount },
          },
        },
      } = response.data;
      dispatch(actions.unreadNotificationsFetched({ totalUnreadCount, unreadEntities }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};


export const updateNotificationState = (id) => (dispatch) => {  
    return requestFromServer
      .markAsRead(id)
      .then((response) => {
        fetchAllNotifications()(dispatch);
        fetchUnreadNotifications()(dispatch);
      })
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        throw error;
      });
  };

  export const updateNotificationsState = () => (dispatch) => {  
    return requestFromServer
      .markAllAsRead()
      .then((response) => {
        fetchAllNotifications()(dispatch);
        fetchUnreadNotifications()(dispatch);
      })
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        throw error;
      });
  };