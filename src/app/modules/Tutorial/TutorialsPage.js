import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/tutorialsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { TutorialsLoadingDialog } from "./tutorials-loading-dialog/TutorialsLoadingDialog";
import { TutorialEditDialog } from "./tutorial-edit-dialog/TutorialEditDialog";
import { TutorialDeleteDialog } from "./tutorial-delete-dialog/TutorialDeleteDialog";
import { TutorialsDeleteDialog } from "./tutorials-delete-dialog/TutorialsDeleteDialog";
import { TutorialsFetchDialog } from "./tutorials-fetch-dialog/TutorialsFetchDialog";
import { TutorialsUpdateStateDialog } from "./tutorials-update-status-dialog/TutorialsUpdateStateDialog";
import { TutorialsUIProvider } from "./TutorialsUIContext";
import { TutorialsCard } from "./TutorialsCard";


export function TutorialsPage({ history }) {
  // tutorials Redux state
  const dispatch = useDispatch();

  const tutorialsUIEvents = {
    newTutorialButtonClick: () => {
      history.push("/tutorial/new");
    },
    openEditTutorialDialog: (row) => {
      history.push(`/tutorial/${row.id}/edit`);
    },
    openDeleteTutorialDialog: (id) => {
      history.push(`/tutorial/${id}/delete`);
    },
    openDeleteTutorialsDialog: () => {
      history.push(`/tutorial/deleteCustomers`);
    },
    openFetchTutorialsDialog: () => {
      history.push(`/tutorial/fetch`);
    },
    openUpdateTutorialsStatusDialog: () => {
      history.push("/tutorial/updateStatus");
    },
  };

  return (
    <TutorialsUIProvider tutorialsUIEvents={tutorialsUIEvents}>
      <TutorialsLoadingDialog />
      <Route path="/tutorial/new">
        {({ history, match }) => (
          <TutorialEditDialog
            show={match != null}
            onHide={() => {
              // dispatch(actions.resetTutorial());
              history.push("/tutorial");
            }}
          />
        )}
      </Route>
      <Route path="/tutorial/:id/edit">
        {({ history, match }) => (
          <TutorialEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              dispatch(actions.resetPosts());
              dispatch(actions.resetTutorial());

              history.push("/tutorial");
            }}
          />
        )}
      </Route>
      <Route path="/tutorial/deleteCustomers">
        {({ history, match }) => (
          <TutorialsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/tutorial");
            }}
          />
        )}
      </Route>
      <Route path="/tutorial/:id/delete">
        {({ history, match }) => (
          <TutorialDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/tutorial");
            }}
          />
        )}
      </Route>
      <Route path="/tutorial/fetch">
        {({ history, match }) => (
          <TutorialsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/tutorial");
            }}
          />
        )}
      </Route>
      <Route path="/tutorial/updateStatus">
        {({ history, match }) => (
          <TutorialsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/tutorial");
            }}
          />
        )}
      </Route>
      <TutorialsCard />
    </TutorialsUIProvider>
  );
}
