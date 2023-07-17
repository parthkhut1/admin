import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/scopesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { ScopesLoadingDialog } from "./scopes-loading-dialog/ScopesLoadingDialog";
import { ScopeEditDialog } from "./scope-edit-dialog/ScopeEditDialog";
import { ScopeDeleteDialog } from "./scope-delete-dialog/ScopeDeleteDialog";
import { ScopesDeleteDialog } from "./scopes-delete-dialog/ScopesDeleteDialog";
import { ScopesFetchDialog } from "./scopes-fetch-dialog/ScopesFetchDialog";
import { ScopesUpdateStateDialog } from "./scopes-update-status-dialog/ScopesUpdateStateDialog";
import { ScopesUIProvider } from "./ScopesUIContext";
import { ScopesCard } from "./ScopesCard";

export function ScopesPage({ history }) {
  const dispatch = useDispatch();

  const scopesUIEvents = {
    newScopeButtonClick: () => {
      history.push("/scope/new");
    },
    openEditScopeDialog: (row) => {
      history.push(`/scope/${row.id}/edit`);
    },
    openDeleteScopeDialog: (id) => {
      history.push(`/scope/${id}/delete`);
    },
    openDeleteScopesDialog: () => {
      history.push(`/scope/deleteCustomers`);
    },
    openFetchScopesDialog: () => {
      history.push(`/scope/fetch`);
    },
    openUpdateScopesStatusDialog: () => {
      history.push("/scope/updateStatus");
    },
  };

  return (
    <ScopesUIProvider scopesUIEvents={scopesUIEvents}>
      <ScopesLoadingDialog />
      <Route path="/scope/new">
        {({ history, match }) => (
          <ScopeEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetScope());

              history.push("/scope");
            }}
          />
        )}
      </Route>
      <Route path="/scope/:id/edit">
        {({ history, match }) => (
          <ScopeEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/scope");
            }}
          />
        )}
      </Route>
      <Route path="/scope/deleteCustomers">
        {({ history, match }) => (
          <ScopesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/scope");
            }}
          />
        )}
      </Route>
      <Route path="/scope/:id/delete">
        {({ history, match }) => (
          <ScopeDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/scope");
            }}
          />
        )}
      </Route>
      <Route path="/scope/fetch">
        {({ history, match }) => (
          <ScopesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/scope");
            }}
          />
        )}
      </Route>
      <Route path="/scope/updateStatus">
        {({ history, match }) => (
          <ScopesUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/scope");
            }}
          />
        )}
      </Route>
      <ScopesCard />
    </ScopesUIProvider>
  );
}
