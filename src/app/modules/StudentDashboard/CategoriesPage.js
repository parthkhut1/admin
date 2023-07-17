import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/categoriesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { CategoriesLoadingDialog } from "./categories-loading-dialog/CategoriesLoadingDialog";
import { CategoryEditDialog } from "./category-edit-dialog/CategoryEditDialog";
import { CategoryDeleteDialog } from "./category-delete-dialog/CategoryDeleteDialog";
import { CategoriesDeleteDialog } from "./categories-delete-dialog/CategoriesDeleteDialog";
import { CategoriesFetchDialog } from "./categories-fetch-dialog/CategoriesFetchDialog";
import { CategoriesUpdateStateDialog } from "./categories-update-status-dialog/CategoriesUpdateStateDialog";
import { CategoriesUIProvider } from "./CategoriesUIContext";
import { CategoriesCard } from "./CategoriesCard";

export function CategoriesPage({ history }) {
  const dispatch = useDispatch();

  const categoriesUIEvents = {
    newCategoryButtonClick: () => {
      history.push("/student-dashboard/new");
    },
    openEditCategoryDialog: (row) => {
      history.push(`/student-dashboard/${row.id}/edit`);
    },
    openDeleteCategoryDialog: (id) => {
      history.push(`/student-dashboard/${id}/delete`);
    },
    openDeleteCategoriesDialog: () => {
      history.push(`/student-dashboard/deleteCustomers`);
    },
    openFetchCategoriesDialog: () => {
      history.push(`/student-dashboard/fetch`);
    },
    openUpdateCategoriesStatusDialog: () => {
      history.push("/student-dashboard/updateStatus");
    },
  };

  return (
    <CategoriesUIProvider categoriesUIEvents={categoriesUIEvents}>
      <CategoriesLoadingDialog />
      <Route path="/student-dashboard/new">
        {({ history, match }) => (
          <CategoryEditDialog
            show={match != null}
            onHide={() => {
              history.push("/student-dashboard");
            }}
          />
        )}
      </Route>
      <Route path="/student-dashboard/:id/edit">
        {({ history, match }) => (
          <CategoryEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/student-dashboard");
            }}
          />
        )}
      </Route>
      <Route path="/student-dashboard/deleteCustomers">
        {({ history, match }) => (
          <CategoriesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/student-dashboard");
            }}
          />
        )}
      </Route>
      <Route path="/student-dashboard/:id/delete">
        {({ history, match }) => (
          <CategoryDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/student-dashboard");
            }}
          />
        )}
      </Route>
      <Route path="/student-dashboard/fetch">
        {({ history, match }) => (
          <CategoriesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/student-dashboard");
            }}
          />
        )}
      </Route>
      <Route path="/student-dashboard/updateStatus">
        {({ history, match }) => (
          <CategoriesUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/student-dashboard");
            }}
          />
        )}
      </Route>
      <CategoriesCard />
    </CategoriesUIProvider>
  );
}
