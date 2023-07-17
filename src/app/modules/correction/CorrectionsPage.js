import React ,{useState}from "react";
import { Route , Switch } from "react-router-dom";
import * as actions from "./_redux/correctionsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";




import { CorrectionsLoadingDialog } from "./corrections-loading-dialog/CorrectionsLoadingDialog";
import { CorrectionEditDialog } from "./correction-edit-dialog/CorrectionEditDialog";
import { CorrectionDeleteDialog } from "./correction-delete-dialog/CorrectionDeleteDialog";
import { CorrectionsDeleteDialog } from "./corrections-delete-dialog/CorrectionsDeleteDialog";
import { CorrectionsFetchDialog } from "./corrections-fetch-dialog/CorrectionsFetchDialog";
import { CorrectionsUpdateStateDialog } from "./corrections-update-status-dialog/CorrectionsUpdateStateDialog";
import { CorrectionsUIProvider } from "./CorrectionsUIContext";
import { CorrectionsCard } from "./CorrectionsCard";


export function CorrectionsPage({ history }) {

  const dispatch = useDispatch();

  const correctionsUIEvents = {
    newCorrectionButtonClick: () => {
      history.push("/correction/new");
    },
    openEditCorrectionDialog: (row) => {
      history.push(`/correction/${row.id}/edit`);
    },
    openDeleteCorrectionDialog: (id) => {
      history.push(`/correction/${id}/delete`);
    },
    openDeleteCorrectionsDialog: () => {
      history.push(`/correction/deleteCustomers`);
    },
    openFetchCorrectionsDialog: () => {
      history.push(`/correction/fetch`);
    },
    openUpdateCorrectionsStatusDialog: () => {
      history.push("/correction/updateStatus");
    }
  }

  return (

    <CorrectionsUIProvider correctionsUIEvents={correctionsUIEvents}>
      <CorrectionsLoadingDialog />
      <Route path="/correction/new">
        {({ history, match }) => (
          <CorrectionEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetCorrection());
              history.push("/correction");
            }}
          />
        )}
      </Route>
      <Route path="/correction/:id/edit">
        {({ history, match }) => (
          <CorrectionEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/correction");
            }}
          />
        )}
      </Route>
      <Route path="/correction/deleteCustomers">
        {({ history, match }) => (
          <CorrectionsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/correction");
            }}
          />
        )}
      </Route>
      <Route path="/correction/:id/delete">
        {({ history, match }) => (
          <CorrectionDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/correction");
            }}
          />
        )}
      </Route>
      <Route path="/correction/fetch">
        {({ history, match }) => (
          <CorrectionsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/correction");
            }}
          />
        )}
      </Route>
      <Route path="/correction/updateStatus">
        {({ history, match }) => (
          <CorrectionsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/correction");
            }}
          />
        )}
      </Route>
      <CorrectionsCard />
    </CorrectionsUIProvider>
  );
}
