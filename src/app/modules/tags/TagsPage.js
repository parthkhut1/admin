import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/tagsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { TagsLoadingDialog } from "./tags-loading-dialog/TagsLoadingDialog";
import { TagEditDialog } from "./tag-edit-dialog/TagEditDialog";
import { TagDeleteDialog } from "./tag-delete-dialog/TagDeleteDialog";
import { TagsDeleteDialog } from "./tags-delete-dialog/TagsDeleteDialog";
import { TagsFetchDialog } from "./tags-fetch-dialog/TagsFetchDialog";
import { TagsUpdateStateDialog } from "./tags-update-status-dialog/TagsUpdateStateDialog";
import { TagsUIProvider } from "./TagsUIContext";
import { TagsCard } from "./TagsCard";

export function TagsPage({ history }) {
  const dispatch = useDispatch();

  const tagsUIEvents = {
    newTagButtonClick: () => {
      history.push("/tag/new");
    },
    openEditTagDialog: (row) => {
      history.push(`/tag/${row.id}/edit`);
    },
    openDeleteTagDialog: (id) => {
      history.push(`/tag/${id}/delete`);
    },
    openDeleteTagsDialog: () => {
      history.push(`/tag/deleteCustomers`);
    },
    openFetchTagsDialog: () => {
      history.push(`/tag/fetch`);
    },
    openUpdateTagsStatusDialog: () => {
      history.push("/tag/updateStatus");
    },
  };

  return (
    <TagsUIProvider tagsUIEvents={tagsUIEvents}>
      <TagsLoadingDialog />
      <Route path="/tag/new">
        {({ history, match }) => (
          <TagEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetTag());

              history.push("/tag");
            }}
          />
        )}
      </Route>
      <Route path="/tag/:id/edit">
        {({ history, match }) => (
          <TagEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/tag");
            }}
          />
        )}
      </Route>
      <Route path="/tag/deleteCustomers">
        {({ history, match }) => (
          <TagsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/tag");
            }}
          />
        )}
      </Route>
      <Route path="/tag/:id/delete">
        {({ history, match }) => (
          <TagDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/tag");
            }}
          />
        )}
      </Route>
      <Route path="/tag/fetch">
        {({ history, match }) => (
          <TagsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/tag");
            }}
          />
        )}
      </Route>
      <Route path="/tag/updateStatus">
        {({ history, match }) => (
          <TagsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/tag");
            }}
          />
        )}
      </Route>
      <TagsCard />
    </TagsUIProvider>
  );
}
