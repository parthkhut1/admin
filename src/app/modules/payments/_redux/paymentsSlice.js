import {createSlice} from "@reduxjs/toolkit";

const initialPaymentsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  entities: null,
  paymentForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const paymentsSlice = createSlice({
  name: "payments",
  initialState: initialPaymentsState,
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
    // getPaymentById
    paymentFetched: (state, action) => {
      state.actionsLoading = false;
      state.paymentForEdit = action.payload.paymentForEdit;
      state.error = null;
    },
    // findPayments
    paymentsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // createPayment
    paymentCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.payment);
    },
    // updatePayment
    paymentUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity.id === action.payload.payment.id) {
          return action.payload.payment;
        }
        return entity;
      });
    },
    // deletePayment
    paymentDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(el => el.id !== action.payload.id);
    },
    // deletePayments
    paymentsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el.id)
      );
    },
    // paymentsUpdateState
    paymentsStatusUpdated: (state, action) => {
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
