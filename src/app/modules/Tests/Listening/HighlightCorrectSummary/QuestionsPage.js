import React from "react";
import { Route , Switch } from "react-router-dom";
import * as actions from "./_redux/questionsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { QuestionsLoadingDialog } from "./questions-loading-dialog/QuestionsLoadingDialog";
import { QuestionEditDialog } from "./question-edit-dialog/QuestionEditDialog";
import { QuestionDeleteDialog } from "./question-delete-dialog/QuestionDeleteDialog";
import {QuestionAddToMockDialog} from "./question-addToMock-dialog/QuestionAddToMockDialog"

import { QuestionsDeleteDialog } from "./questions-delete-dialog/QuestionsDeleteDialog";
import { QuestionsFetchDialog } from "./questions-fetch-dialog/QuestionsFetchDialog";
import { QuestionsUpdateStateDialog } from "./questions-update-status-dialog/QuestionsUpdateStateDialog";
import { QuestionsUIProvider } from "./QuestionsUIContext";
import { QuestionsCard } from "./QuestionsCard";


export function QuestionsPage({ history }) {
const dispatch = useDispatch();
  const questionsUIEvents = {
    newQuestionButtonClick: () => {
      history.push("/listening/highlight-correct-summary/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/listening/highlight-correct-summary/${id}/edit`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/listening/highlight-correct-summary/${id}/add-to-mock-test`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/listening/highlight-correct-summary/${id}/delete`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/listening/highlight-correct-summary/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/listening/highlight-correct-summary/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/listening/highlight-correct-summary/updateStatus");
    }
  }

  return (

    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
      <Route path="/listening/highlight-correct-summary/new">
        {({ history, match }) => (
          <QuestionEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetQuestion());

              history.push("/listening/highlight-correct-summary");
            }}
          />
        )}
      </Route>
      <Route path="/listening/highlight-correct-summary/:id/edit">
        {({ history, match }) => (
          <QuestionEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              dispatch(actions.resetQuestion());

              history.push("/listening/highlight-correct-summary");
            }}
          />
        )}
      </Route>
      <Route path="/listening/highlight-correct-summary/:id/add-to-mock-test">
        {({ history, match }) => (
          <QuestionAddToMockDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/listening/highlight-correct-summary");
            }}
          />
        )}
      </Route>
      <Route path="/listening/highlight-correct-summary/deleteCustomers">
        {({ history, match }) => (
          <QuestionsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/listening/highlight-correct-summary");
            }}
          />
        )}
      </Route>
      <Route path="/listening/highlight-correct-summary/:id/delete">
        {({ history, match }) => (
          <QuestionDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/listening/highlight-correct-summary");
            }}
          />
        )}
      </Route>
      <Route path="/listening/highlight-correct-summary/fetch">
        {({ history, match }) => (
          <QuestionsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/listening/highlight-correct-summary");
            }}
          />
        )}
      </Route>
      <Route path="/listening/highlight-correct-summary/updateStatus">
        {({ history, match }) => (
          <QuestionsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/listening/highlight-correct-summary");
            }}
          />
        )}
      </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
