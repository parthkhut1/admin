import * as requestFromServer from "./ticketsCrud";
import { ticketsSlice, callTypes } from "./ticketsSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";

const { actions } = ticketsSlice;

export const resetTicket = () => (dispatch) => {
  return dispatch(actions.ticketFetched({ ticketForEdit: undefined }));
};

export const fetchTickets = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findTickets(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: {
              total: totalCount,
              per_page: perPage,
              current_page: currentPage,
            },
          },
        },
      } = response.data;

      dispatch(
        actions.ticketsFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            priority: Object.values(e.priority)[0],
            category: Object.values(e.category)[0],
            closed_at: e.closed_at
              ? format(new Date(e.closed_at), "yyyy-MM-dd")
              : "Not closed",
            created_at: format(new Date(e.created_at), "yyyy-MM-dd"),
          })),
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

export const fetchTicket = (ticketId) => (dispatch) => {
  dispatch(actions.messagesReset());

  if (!ticketId) {
    return dispatch(actions.ticketFetched({ ticketForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getTicketById(ticketId)
    .then((response) => {
      const {
        data: { payload: ticket },
      } = response;
      dispatch(
        actions.ticketFetched({
          ticketForEdit: {
            ...ticket,
            priority: Object.values(ticket.priority)[0],
            category: Object.values(ticket.category)[0],
            opened: ticket.closed_at ? true : false,
          },
        })
      );
      fetchMessages(ticket.id)(dispatch);
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

export const deleteTicket = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteTicket(id)
    .then((response) => {
      dispatch(actions.ticketDeleted({ id }));
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

export const createTicket = (ticketForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createTicket(ticketForCreation)
    .then((response) => {
      const { ticket } = response.data;
      dispatch(actions.ticketCreated({ ticket }));
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

export const updateTicket = (ticket) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateTicket(ticket)
    .then(() => {
      dispatch(actions.ticketUpdated({ ticket }));
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

export const changeTicketState = (ticketId, state) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .changeTicketState(ticketId, state)
    .then((response) => {
      dispatch(actions.catchError({ callType: "action" }));
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

export const updateTicketsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForTickets(ids, status)
    .then(() => {
      dispatch(actions.ticketsStatusUpdated({ ids, status }));
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

export const deleteTickets = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteTickets(ids)
    .then(() => {
      dispatch(actions.ticketsDeleted({ ids }));
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

export const fetchMessages = (ticketId, page = 1) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .fetchMessages(ticketId, page)
    .then((response) => {
      const {
        payload: {
          data: messages,
          meta: {
            pagination: { total_pages: totalCount },
          },
        },
      } = response.data;

      dispatch(
        actions.messagesFetched({
          messageTotalCount: totalCount,
          messages,
        })
      );
      dispatch(actions.catchError({ callType: "action" }));
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
    .sendMessage(data)
    .then(() => {
      fetchMessages(data.ticket_id)(dispatch);
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

export const editMessage = (messageId, data, ticketId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .editMessage(messageId, data)
    .then(() => {
      fetchMessages(ticketId)(dispatch);
      SnackbarUtils.success("message was edited!");
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
      SnackbarUtils.error("Some error was occurred.");
      throw error;
    });
};

export const deleteMessage = (ticketId, id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteMessage(id)
    .then((response) => {
      dispatch(actions.ticketDeleted({ id }));
      fetchMessages(ticketId)(dispatch);
      SnackbarUtils.success("message was deleted!");
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
      SnackbarUtils.error("Some error was occurred.");

      throw error;
    });
};
