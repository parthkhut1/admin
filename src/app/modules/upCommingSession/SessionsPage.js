import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

// import { SessionsLoadingDialog } from "./sessions-loading-dialog/SessionsLoadingDialog";
// import { SessionEditDialog } from "./session-edit-dialog/SessionEditDialog";
// import { SessionDeleteDialog } from "./session-delete-dialog/SessionDeleteDialog";
// import { SessionsDeleteDialog } from "./sessions-delete-dialog/SessionsDeleteDialog";
// import { SessionsFetchDialog } from "./sessions-fetch-dialog/SessionsFetchDialog";
// import { SessionsUpdateStateDialog } from "./sessions-update-status-dialog/SessionsUpdateStateDialog";
import { SessionsUIProvider } from "./SessionsUIContext";
import { SessionsCard } from "./SessionsCard";

export function UpCommingSesseionPage({ history }) {
  const dispatch = useDispatch();

  const sessionsUIEvents = {
    // newSessionButtonClick: () => {
    //   history.push("/up-comming-session/new");
    // },
    // openEditSessionDialog: (row) => {
    //   // if (row.canceled_at) history.push(`/up-comming-session/${row.id}/cancel`);
    //   // else
    //    history.push(`/up-comming-session/${row.id}/edit`);
    // },
    // openDeleteSessionDialog: (id) => {
    //   history.push(`/up-comming-session/${id}/delete`);
    // },
    // openDeleteSessionsDialog: () => {
    //   history.push(`/up-comming-session/deleteCustomers`);
    // },
    // openFetchSessionsDialog: () => {
    //   history.push(`/up-comming-session/fetch`);
    // },
    // openUpdateSessionsStatusDialog: () => {
    //   history.push("/up-comming-session/updateStatus");
    // },
  };

  return (
    <SessionsUIProvider sessionsUIEvents={sessionsUIEvents}>
      {/* <SessionsLoadingDialog />
      <Route path="/up-comming-session/new">
        {({ history, match }) => (
          <SessionEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetSession());

              history.push("/up-comming-session");
            }}
          />
        )}
      </Route>
      <Route path="/up-comming-session/:id/edit">
        {({ history, match }) => (
          <SessionEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/up-comming-session");
            }}
          />
        )}
      </Route> */}
      {/* <Route path="/up-comming-session/deleteCustomers"> */}
      {/* <Route path="/up-comming-session/:id/cancel">
        {" "}
        {({ history, match }) => (
          <SessionsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/up-comming-session");
            }}
          />
        )}
      </Route>
      <Route path="/up-comming-session/:id/delete">
        {({ history, match }) => (
          <SessionDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/up-comming-session");
            }}
          />
        )}
      </Route>
      <Route path="/up-comming-session/fetch">
        {({ history, match }) => (
          <SessionsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/up-comming-session");
            }}
          />
        )}
      </Route>
      <Route path="/up-comming-session/updateStatus">
        {({ history, match }) => (
          <SessionsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/up-comming-session");
            }}
          />
        )}
      </Route>
       */}
      <SessionsCard />
    </SessionsUIProvider>
  );
}
