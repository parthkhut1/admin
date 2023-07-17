import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/paymentsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { PaymentsLoadingDialog } from "./payments-loading-dialog/PaymentsLoadingDialog";
import { PaymentEditDialog } from "./payment-edit-dialog/PaymentEditDialog";
import { PaymentDeleteDialog } from "./payment-delete-dialog/PaymentDeleteDialog";
import { PaymentsDeleteDialog } from "./payments-delete-dialog/PaymentsDeleteDialog";
import { PaymentsFetchDialog } from "./payments-fetch-dialog/PaymentsFetchDialog";
import { PaymentsUpdateStateDialog } from "./payments-update-status-dialog/PaymentsUpdateStateDialog";
import { PaymentsUIProvider } from "./PaymentLogsUIContext";
import { PaymentsCard } from "./PaymentLogsCard";

export function PaymentsPage({ history }) {
  const dispatch = useDispatch();

  const [payment, setPayment] = useState(null);
  const paymentsUIEvents = {
    newPaymentButtonClick: () => {
      history.push("/payment-logs/new");
    },
    openEditPaymentDialog: (row) => {
      setPayment(row);
      history.push(`/payment-logs/${row.id}/edit`);
    },
    openDeletePaymentDialog: (id) => {
      history.push(`/payment-logs/${id}/delete`);
    },
    openDeletePaymentsDialog: () => {
      history.push(`/payment-logs/deleteCustomers`);
    },
    openFetchPaymentsDialog: () => {
      history.push(`/payment-logs/fetch`);
    },
    openUpdatePaymentsStatusDialog: () => {
      history.push("/payment-logs/updateStatus");
    },
  };

  return (
    <PaymentsUIProvider paymentsUIEvents={paymentsUIEvents}>
      <PaymentsLoadingDialog />
      <Route path="/payment-logs/new">
        {({ history, match }) => (
          <PaymentEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetPayment());

              history.push("/payment-logs");
            }}
          />
        )}
      </Route>
      <Route path="/payment-logs/:id/edit">
        {({ history, match }) => (
          <PaymentEditDialog
            show={match != null}
            id={match && match.params.id}
            payment={payment}
            onHide={() => {
              history.push("/payment-logs");
            }}
          />
        )}
      </Route>
      <Route path="/payment-logs/deleteCustomers">
        {({ history, match }) => (
          <PaymentsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/payment-logs");
            }}
          />
        )}
      </Route>
      <Route path="/payment-logs/:id/delete">
        {({ history, match }) => (
          <PaymentDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/payment-logs");
            }}
          />
        )}
      </Route>
      <Route path="/payment-logs/fetch">
        {({ history, match }) => (
          <PaymentsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/payment-logs");
            }}
          />
        )}
      </Route>
      <Route path="/payment-logs/updateStatus">
        {({ history, match }) => (
          <PaymentsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/payment-logs");
            }}
          />
        )}
      </Route>
      <PaymentsCard />
    </PaymentsUIProvider>
  );
}
