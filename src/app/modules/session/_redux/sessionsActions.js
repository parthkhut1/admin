import * as requestFromServer from "./sessionsCrud";
import { sessionsSlice, callTypes } from "./sessionsSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";

const { actions } = sessionsSlice;

export const resetSession = () => (dispatch) => {
  return dispatch(actions.sessionFetched({ sessionForEdit: undefined }));
};

export const fetchSessions = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findSessions(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: {
              total: totalCount,
              total_pages: totalPages,
              per_page: perPage,
              current_page: currentPage
            }
          }
        }
      } = response.data;

      dispatch(
        actions.sessionsFetched({
          totalPages,
          perPage,
          currentPage,
          totalCount,
          entities: entities.map((e) => ({
            ...e,
            started_at: `${format(
              new Date(e.started_at),
              "yyyy-MM-dd"
            )}-${format(new Date(e.started_at), "HH:mm")}`,
            is_free: e.is_free ? "Free" : "Paid",
            is_private: e.is_private ? "Private" : "Normal",
            tags: e.tags.join(),
            is_canceled: e.is_cancelable ? "Yes" : "No",
            canceled_at: `${
              e.canceled_at
                ? `${format(new Date(e.canceled_at), "yyyy-MM-dd")}`
                : "-"
            }`
          }))
        })
      );
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

export const fetchSessionBookingList = (sessionId, page = 1) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getSessionBookingList(sessionId, page)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total_pages: totalPage }
          }
        }
      } = response.data;

      dispatch(
        actions.sessionBookingListFetched({
          entities,
          totalPage
        })
      );
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

export const addBooking = (data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addBooking(data)
    .then((response) => {
      fetchSessionBookingList(data.session_id)(dispatch);
      SnackbarUtils.success("Session was Booked successfully");
      dispatch(actions.catchError({ callTypes: "action" }));
    })
    .catch((error) => {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);

      dispatch(actions.catchError({ error }));
      throw error;
    });
};

export const sessionCancellation = (sessionId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .cancelSession(sessionId)
    .then(() => {
      dispatch(actions.catchError({ callType: "action" }));
      fetchSessions()(dispatch);
      SnackbarUtils.success("Session canceled successfully!");
    })
    .catch((error) => {
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      dispatch(actions.catchError({ error }));
      throw error;
    });
};

export const deleteBooking = (sessionId, bookingId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .deleteBooking(bookingId)
    .then((response) => {
      fetchSessionBookingList(sessionId)(dispatch);
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

export const fetchSession = (sessionId) => (dispatch) => {
  if (!sessionId) {
    return dispatch(actions.sessionFetched({ sessionForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getSessionById(sessionId)
    .then((response) => {
      const {
        data: { payload: session }
      } = response;
      dispatch(actions.sessionFetched({ sessionForEdit: session }));
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

export const deleteSession = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteSession(id)
    .then((response) => {
      dispatch(actions.sessionDeleted({ id }));
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

export const createSession = (sessionForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createSession(sessionForCreation)
    .then((response) => {
      const { session } = response.data;
      dispatch(actions.sessionCreated({ session }));
      SnackbarUtils.success("Session created successfully!");
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

export const updateSession = (session) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateSession(session)
    .then(() => {
      dispatch(actions.sessionUpdated({ session }));
      SnackbarUtils.success("Session updated successfully!");
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

export const updateSessionsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForSessions(ids, status)
    .then(() => {
      dispatch(actions.sessionsStatusUpdated({ ids, status }));
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

export const deleteSessions = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteSessions(ids)
    .then(() => {
      dispatch(actions.sessionsDeleted({ ids }));
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

export const sendMessage = (data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createTicket(data)
    .then((response) => {
      const { payload: ticket } = response.data;
      const newData = {
        ...data,
        ticket_id: ticket.id
      };
      createTicketMessage(newData)(dispatch);
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

export const createTicketMessage = (data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createTicketMessage(data)
    .then(() => {
      SnackbarUtils.success("Message was sent successfully.");
      dispatch(actions.catchError({ callTypes: "action" }));
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
