import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/reportsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { ReportsLoadingDialog } from "./reports-loading-dialog/ReportsLoadingDialog";
import { ReportEditDialog } from "./report-edit-dialog/ReportEditDialog";
import { ReportDeleteDialog } from "./report-delete-dialog/ReportDeleteDialog";
import { ReportsDeleteDialog } from "./reports-delete-dialog/ReportsDeleteDialog";
import { ReportsFetchDialog } from "./reports-fetch-dialog/ReportsFetchDialog";
import { ReportsUpdateStateDialog } from "./reports-update-status-dialog/ReportsUpdateStateDialog";
import { ReportsUIProvider } from "./ReportsUIContext";
import { ReportsCard } from "./ReportsCard";

export function ReportsPage({ history }) {
  const dispatch = useDispatch();

  const reportsUIEvents = {
    newReportButtonClick: () => {
      // history.push("/question-reports/new");
    },
    openEditReportDialog: (row) => {
      // history.push(`/question-reports/${row.id}/edit`);
    },
    openDeleteReportDialog: (id) => {
      // history.push(`/question-reports/${id}/delete`);
    },
    openDeleteReportsDialog: () => {
      // history.push(`/question-reports/deleteCustomers`);
    },
    openFetchReportsDialog: () => {
      // history.push(`/question-reports/fetch`);
    },
    openUpdateReportsStatusDialog: () => {
      // history.push("/question-reports/updateStatus");
    },
  };

  return (
    <ReportsUIProvider reportsUIEvents={reportsUIEvents}>
      <ReportsLoadingDialog />
      <Route path="/question-reports/new">
        {({ history, match }) => (
          <ReportEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetReport());

              history.push("/question-reports");
            }}
          />
        )}
      </Route>
      <Route path="/question-reports/:id/edit">
        {({ history, match }) => (
          <ReportEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/question-reports");
            }}
          />
        )}
      </Route>
      <Route path="/question-reports/deleteCustomers">
        {({ history, match }) => (
          <ReportsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/question-reports");
            }}
          />
        )}
      </Route>
      <Route path="/question-reports/:id/delete">
        {({ history, match }) => (
          <ReportDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/question-reports");
            }}
          />
        )}
      </Route>
      <Route path="/question-reports/fetch">
        {({ history, match }) => (
          <ReportsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/question-reports");
            }}
          />
        )}
      </Route>
      <Route path="/question-reports/updateStatus">
        {({ history, match }) => (
          <ReportsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/question-reports");
            }}
          />
        )}
      </Route>
      <ReportsCard />
    </ReportsUIProvider>
  );
}
