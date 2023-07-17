import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/sessionsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { SessionsLoadingDialog } from "./sessions-loading-dialog/SessionsLoadingDialog";
import { SessionEditDialog } from "./session-edit-dialog/SessionEditDialog";
import { SessionDeleteDialog } from "./session-delete-dialog/SessionDeleteDialog";
import { SessionsDeleteDialog } from "./sessions-delete-dialog/SessionsDeleteDialog";
import { SessionsFetchDialog } from "./sessions-fetch-dialog/SessionsFetchDialog";
import { SessionsUpdateStateDialog } from "./sessions-update-status-dialog/SessionsUpdateStateDialog";
import { SessionsUIProvider } from "./SessionsUIContext";
import { SessionsCard } from "./SessionsCard";

export function SessionsPage({ history }) {
  const dispatch = useDispatch();

  const sessionsUIEvents = {
    newSessionButtonClick: () => {
      history.push("/session/new");
    },
    openEditSessionDialog: (row) => {
      // if (row.canceled_at) history.push(`/session/${row.id}/cancel`);
      // else
       history.push(`/session/${row.id}/edit`);
    },
    openDeleteSessionDialog: (id) => {
      history.push(`/session/${id}/delete`);
    },
    openDeleteSessionsDialog: () => {
      history.push(`/session/deleteCustomers`);
    },
    openFetchSessionsDialog: () => {
      history.push(`/session/fetch`);
    },
    openUpdateSessionsStatusDialog: () => {
      history.push("/session/updateStatus");
    },
  };

  return (
    <SessionsUIProvider sessionsUIEvents={sessionsUIEvents}>
      <SessionsLoadingDialog />
      <Route path="/session/new">
        {({ history, match }) => (
          <SessionEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetSession());

              history.push("/session");
            }}
          />
        )}
      </Route>
      <Route path="/session/:id/edit">
        {({ history, match }) => (
          <SessionEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/session");
            }}
          />
        )}
      </Route>
      {/* <Route path="/session/deleteCustomers"> */}
      <Route path="/session/:id/cancel">
        {" "}
        {({ history, match }) => (
          <SessionsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/session");
            }}
          />
        )}
      </Route>
      <Route path="/session/:id/delete">
        {({ history, match }) => (
          <SessionDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/session");
            }}
          />
        )}
      </Route>
      <Route path="/session/fetch">
        {({ history, match }) => (
          <SessionsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/session");
            }}
          />
        )}
      </Route>
      <Route path="/session/updateStatus">
        {({ history, match }) => (
          <SessionsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/session");
            }}
          />
        )}
      </Route>
      <SessionsCard />
    </SessionsUIProvider>
  );
}
