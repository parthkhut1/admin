import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/ticketsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { TicketsLoadingDialog } from "./tickets-loading-dialog/TicketsLoadingDialog";
import { TicketEditDialog } from "./ticket-edit-dialog/TicketEditDialog";
import { TicketDeleteDialog } from "./ticket-delete-dialog/TicketDeleteDialog";
import { TicketsDeleteDialog } from "./tickets-delete-dialog/TicketsDeleteDialog";
import { TicketsFetchDialog } from "./tickets-fetch-dialog/TicketsFetchDialog";
import { TicketsUpdateStateDialog } from "./tickets-update-status-dialog/TicketsUpdateStateDialog";
import { TicketsUIProvider } from "./TicketsUIContext";
import { TicketsCard } from "./TicketsCard";


export function TicketsPage({ history }) {
  const dispatch = useDispatch();

  const ticketsUIEvents = {
    newTicketButtonClick: () => {
      history.push("/ticket/new");
    },
    openEditTicketDialog: (row) => {
      history.push(`/ticket/${row.id}/edit`);
    },
    openDeleteTicketDialog: (id) => {
      history.push(`/ticket/${id}/delete`);
    },
    openDeleteTicketsDialog: () => {
      history.push(`/ticket/deleteCustomers`);
    },
    openFetchTicketsDialog: () => {
      history.push(`/ticket/fetch`);
    },
    openUpdateTicketsStatusDialog: () => {
      history.push("/ticket/updateStatus");
    },
  };

  return (
    <TicketsUIProvider ticketsUIEvents={ticketsUIEvents}>
      <TicketsLoadingDialog />
      <Route path="/ticket/new">
        {({ history, match }) => (
          <TicketEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetTicket());

              history.push("/ticket");
            }}
          />
        )}
      </Route>
      <Route path="/ticket/:id/edit">
        {({ history, match }) => (
          <TicketEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/ticket");
            }}
          />
        )}
      </Route>
      <Route path="/ticket/deleteCustomers">
        {({ history, match }) => (
          <TicketsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/ticket");
            }}
          />
        )}
      </Route>
      <Route path="/ticket/:id/delete">
        {({ history, match }) => (
          <TicketDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/ticket");
            }}
          />
        )}
      </Route>
      <Route path="/ticket/fetch">
        {({ history, match }) => (
          <TicketsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/ticket");
            }}
          />
        )}
      </Route>
      <Route path="/ticket/updateStatus">
        {({ history, match }) => (
          <TicketsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/ticket");
            }}
          />
        )}
      </Route>
      <TicketsCard />
    </TicketsUIProvider>
  );
}
