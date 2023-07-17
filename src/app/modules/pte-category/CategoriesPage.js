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
      history.push("/category/new");
    },
    openEditCategoryDialog: (row) => {
      history.push(`/category/${row.id}/edit`);
    },
    openDeleteCategoryDialog: (id) => {
      history.push(`/category/${id}/delete`);
    },
    openDeleteCategoriesDialog: () => {
      history.push(`/category/deleteCustomers`);
    },
    openFetchCategoriesDialog: () => {
      history.push(`/category/fetch`);
    },
    openUpdateCategoriesStatusDialog: () => {
      history.push("/category/updateStatus");
    },
  };

  return (
    <CategoriesUIProvider categoriesUIEvents={categoriesUIEvents}>
      <CategoriesLoadingDialog />
      <Route path="/category/new">
        {({ history, match }) => (
          <CategoryEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetCategory());
              dispatch(actions.resetLevel1());
              dispatch(actions.resetLevel2());
              dispatch(actions.resetTree());

              history.push("/category");
            }}
          />
        )}
      </Route>
      <Route path="/category/:id/edit">
        {({ history, match }) => (
          <CategoryEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              dispatch(actions.resetLevel1());
              dispatch(actions.resetLevel2());
              dispatch(actions.resetTree());
              history.push("/category");
            }}
          />
        )}
      </Route>
      <Route path="/category/deleteCustomers">
        {({ history, match }) => (
          <CategoriesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/category");
            }}
          />
        )}
      </Route>
      <Route path="/category/:id/delete">
        {({ history, match }) => (
          <CategoryDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/category");
            }}
          />
        )}
      </Route>
      <Route path="/category/fetch">
        {({ history, match }) => (
          <CategoriesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/category");
            }}
          />
        )}
      </Route>
      <Route path="/category/updateStatus">
        {({ history, match }) => (
          <CategoriesUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/category");
            }}
          />
        )}
      </Route>
      <CategoriesCard />
    </CategoriesUIProvider>
  );
}
