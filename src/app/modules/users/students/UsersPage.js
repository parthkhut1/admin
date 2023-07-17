import React from "react";
import { Route , Switch } from "react-router-dom";
import * as actions from "./_redux/usersActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { UsersLoadingDialog } from "./users-loading-dialog/UsersLoadingDialog";
import { UserEditDialog } from "./user-edit-dialog/UserEditDialog";
import { UserDeleteDialog } from "./user-delete-dialog/UserDeleteDialog";
import { UsersDeleteDialog } from "./users-delete-dialog/UsersDeleteDialog";
import { UsersFetchDialog } from "./users-fetch-dialog/UsersFetchDialog";
import { UsersUpdateStateDialog } from "./users-update-status-dialog/UsersUpdateStateDialog";
import { UsersUIProvider } from "./UsersUIContext";
import { UsersCard } from "./UsersCard";

export function UsersPage({ history }) {
  const dispatch = useDispatch();

  const usersUIEvents = {
    newUserButtonClick: () => {
      history.push("/students/new");
    },
    openEditUserDialog: (id) => {
      history.push(`/students/${id}/edit`);
    },
    openDeleteUserDialog: (id) => {
      history.push(`/students/${id}/delete`);
    },
    openDeleteUsersDialog: () => {
      history.push(`/students/deleteCustomers`);
    },
    openFetchUsersDialog: () => {
      history.push(`/students/fetch`);
    },
    openUpdateUsersStatusDialog: () => {
      history.push("/students/updateStatus");
    },
  };

  return (
    <UsersUIProvider usersUIEvents={usersUIEvents}>
      <UsersLoadingDialog />
      <Switch>
        <Route path="/students/new">
          {({ history, match }) => (
            <UserEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetUser());

                history.push("/students");
              }}
            />
          )}
        </Route>
        <Route path="/students/:id/edit">
          {({ history, match }) => (
            <UserEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/students");
              }}
            />
          )}
        </Route>
        <Route path="/students/deleteCustomers">
          {({ history, match }) => (
            <UsersDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/students");
              }}
            />
          )}
        </Route>
        <Route path="/students/:id/delete">
          {({ history, match }) => (
            <UserDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/students");
              }}
            />
          )}
        </Route>
        <Route path="/students/fetch">
          {({ history, match }) => (
            <UsersFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/students");
              }}
            />
          )}
        </Route>
        <Route path="/students/updateStatus">
          {({ history, match }) => (
            <UsersUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/students");
              }}
            />
          )}
        </Route>
      </Switch>
      <UsersCard />
    </UsersUIProvider>
  );
}
