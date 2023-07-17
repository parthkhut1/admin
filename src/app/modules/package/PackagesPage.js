import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/packagesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { PackagesLoadingDialog } from "./packages-loading-dialog/PackagesLoadingDialog";
import { PackageEditDialog } from "./package-edit-dialog/PackageEditDialog";
import { PackageDeleteDialog } from "./package-delete-dialog/PackageDeleteDialog";
import { PackagesDeleteDialog } from "./packages-delete-dialog/PackagesDeleteDialog";
import { PackagesFetchDialog } from "./packages-fetch-dialog/PackagesFetchDialog";
import { PackagesUpdateStateDialog } from "./packages-update-status-dialog/PackagesUpdateStateDialog";
import { PackagesUIProvider } from "./PackagesUIContext";
import { PackagesCard } from "./PackagesCard";

export function PackagesPage({ history }) {
  const dispatch = useDispatch();

  const packagesUIEvents = {
    newPackageButtonClick: () => {
      history.push("/package/new");
    },
    openEditPackageDialog: (id) => {
      history.push(`/package/${id}/edit`);
    },
    openDeletePackageDialog: (id) => {
      history.push(`/package/${id}/delete`);
    },
    openDeletePackagesDialog: () => {
      history.push(`/package/deleteCustomers`);
    },
    openFetchPackagesDialog: () => {
      history.push(`/package/fetch`);
    },
    openUpdatePackagesStatusDialog: () => {
      history.push("/package/updateStatus");
    },
  };

  return (
    <PackagesUIProvider packagesUIEvents={packagesUIEvents}>
      <PackagesLoadingDialog />
      <Route path="/package/new">
        {({ history, match }) => (
          <PackageEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetPackage());
              dispatch(actions.resetFilteredQuestions());
              dispatch(actions.resetUsersPackagesListFetched());
              dispatch(actions.resetFilteredMocks());
              dispatch(actions.resetFilteredSessions());

              history.push("/package");
            }}
          />
        )}
      </Route>
      <Route path="/package/:id/edit">
        {({ history, match }) => (
          <PackageEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              dispatch(actions.resetFilteredQuestions());
              dispatch(actions.resetFilteredMocks());
              dispatch(actions.resetUsersPackagesListFetched());
              dispatch(actions.resetFilteredSessions());
              history.push("/package");
            }}
          />
        )}
      </Route>
      <Route path="/package/deleteCustomers">
        {({ history, match }) => (
          <PackagesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/package");
            }}
          />
        )}
      </Route>
      <Route path="/package/:id/delete">
        {({ history, match }) => (
          <PackageDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/package");
            }}
          />
        )}
      </Route>
      <Route path="/package/fetch">
        {({ history, match }) => (
          <PackagesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/package");
            }}
          />
        )}
      </Route>
      <Route path="/package/updateStatus">
        {({ history, match }) => (
          <PackagesUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/package");
            }}
          />
        )}
      </Route>
      <PackagesCard />
    </PackagesUIProvider>
  );
}
