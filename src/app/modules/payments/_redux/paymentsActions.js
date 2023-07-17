import * as requestFromServer from "./paymentsCrud";
import { paymentsSlice, callTypes } from "./paymentsSlice";
import SnackbarUtils from "./../../../notistack";
import moment from "moment";

const { actions } = paymentsSlice;

export const resetPayment = () => (dispatch) => {
  return dispatch(actions.paymentFetched({ paymentForEdit: undefined }));
};

export const fetchPayments = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findPayments(queryParams)
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
        actions.paymentsFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            created_at: moment(e.created_at, "YYYY-MM-DD HH:mm").format(
              "YYYY-MM-DD HH:mm"
            ),
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

export const fetchPayment = (payment) => (dispatch) => {
  if (!payment?.id) {
    return dispatch(actions.paymentFetched({ paymentForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getPaymentById(payment)
    .then((response) => {
      const {
        data: { payload: payment },
      } = response;

      console.log("response", payment);
      dispatch(actions.paymentFetched({ paymentForEdit: payment }));
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

export const deletePayment = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePayment(id)
    .then((response) => {
      dispatch(actions.paymentDeleted({ id }));
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

export const createPayment = (paymentForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createPayment(paymentForCreation)
    .then((response) => {
      const { payment } = response.data;
      dispatch(actions.paymentCreated({ payment }));
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

export const updatePayment = (payment) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updatePayment(payment)
    .then(() => {
      dispatch(actions.paymentUpdated({ payment }));
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

export const updatePaymentsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForPayments(ids, status)
    .then(() => {
      dispatch(actions.paymentsStatusUpdated({ ids, status }));
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

export const deletePayments = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePayments(ids)
    .then(() => {
      dispatch(actions.paymentsDeleted({ ids }));
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
