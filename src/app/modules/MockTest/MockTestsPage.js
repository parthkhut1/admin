import React from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/mockTestsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { MockTestsLoadingDialog } from "./mockTests-loading-dialog/MockTestsLoadingDialog";
import { MockTestEditDialog } from "./mockTest-edit-dialog/MockTestEditDialog";
import { MockTestDeleteDialog } from "./mockTest-delete-dialog/MockTestDeleteDialog";
import { MockTestsDeleteDialog } from "./mockTests-delete-dialog/MockTestsDeleteDialog";
import { MockTestsFetchDialog } from "./mockTests-fetch-dialog/MockTestsFetchDialog";
import { MockTestsUpdateStateDialog } from "./mockTests-update-status-dialog/MockTestsUpdateStateDialog";
import { MockTestsUIProvider } from "./MockTestsUIContext";
import { MockTestsCard } from "./MockTestsCard";

export function MockTestsPage({ history }) {
  // mockTests Redux state
  const dispatch = useDispatch();
  const { actionsLoading, mockTestForEdit, perPage, currentPage } = useSelector(
    (state) => ({
      actionsLoading: state.mockTests.actionsLoading,
      mockTestForEdit: state.mockTests.mockTestForEdit,
      perPage: state.mockTests.perPage,
      currentPage: state.mockTests.currentPage,
    }),
    shallowEqual
  );

  const mockTestsUIEvents = {
    newMockTestButtonClick: () => {
      history.push("/mock-test/new");
    },
    openEditMockTestDialog: (id) => {
      history.push(`/mock-test/${id}/edit`);
    },
    openDeleteMockTestDialog: (id) => {
      history.push(`/mock-test/${id}/delete`);
    },
    openDeleteMockTestsDialog: () => {
      history.push(`/mock-test/deletemockTests`);
    },
    openFetchMockTestsDialog: () => {
      history.push(`/mock-test/fetch`);
    },
    openUpdateMockTestsStatusDialog: () => {
      history.push("/mock-test/updateStatus");
    },
  };

  return (
    <MockTestsUIProvider mockTestsUIEvents={mockTestsUIEvents}>
      <MockTestsLoadingDialog />
      <Route path="/mock-test/new">
        {({ history, match }) => (
          <MockTestEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetMockTest());
              dispatch(actions.resetFilteredQuestions());
              history.push("/mock-test");
            }}
          />
        )}
      </Route>
      <Route path="/mock-test/:id/edit">
        {({ history, match }) => (
          <MockTestEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              dispatch(actions.resetFilteredQuestions());
              dispatch(
                actions.fetchMockTests({
                  pageNumber: currentPage,
                  pageSize: perPage,
                  sortField: "id",
                  filter: [],
                })
              );

              history.push("/mock-test");
            }}
          />
        )}
      </Route>
      <Route path="/mock-test/deletemockTests">
        {({ history, match }) => (
          <MockTestsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/mock-test");
            }}
          />
        )}
      </Route>
      <Route path="/mock-test/:id/delete">
        {({ history, match }) => (
          <MockTestDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/mock-test");
            }}
          />
        )}
      </Route>
      <Route path="/mock-test/fetch">
        {({ history, match }) => (
          <MockTestsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/mock-test");
            }}
          />
        )}
      </Route>
      <Route path="/mock-test/updateStatus">
        {({ history, match }) => (
          <MockTestsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/mock-test");
            }}
          />
        )}
      </Route>
      <MockTestsCard />
    </MockTestsUIProvider>
  );
}
