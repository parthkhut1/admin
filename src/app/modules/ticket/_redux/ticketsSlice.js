import { createSlice } from "@reduxjs/toolkit";
import { uniq, uniqBy } from "lodash";


const initialTicketsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  messageTotalCount: 0,
  entities: null,
  ticketForEdit: undefined,
  lastError: null,
  messages: [],
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const ticketsSlice = createSlice({
  name: "tickets",
  initialState: initialTicketsState,
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
    // getticketById
    ticketFetched: (state, action) => {
      state.actionsLoading = false;
      state.ticketForEdit = action.payload.ticketForEdit;
      state.error = null;
    },
    // findtickets
    ticketsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    ticketsReset: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.ticketForEdit = undefined;
    },
    messagesFetched: (state, action) => {
      const { messageTotalCount, messages } = action.payload;
      state.listLoading = false;
      state.error = null;
      state.messages = uniqBy( [...messages,...state.messages] , 'id');
      // state.messages = messages;
      state.messageTotalCount = messageTotalCount;
    },
    messagesReset: (state, action) => {
      state.listLoading = false;
      state.error = null;
      state.messages = [];
      state.messageTotalCount = 1;
    },
    // createticket
    ticketCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.ticket);
    },
    // updateticket
    ticketUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.ticket.id) {
          return action.payload.ticket;
        }
        return entity;
      });
    },
    // deleteticket
    ticketDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletetickets
    ticketsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // ticketsUpdateState
    ticketsStatusUpdated: (state, action) => {
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
