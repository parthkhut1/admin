import React from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/questionsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { QuestionsLoadingDialog } from "./questions-loading-dialog/QuestionsLoadingDialog";
import { QuestionEditDialog } from "./question-edit-dialog/QuestionEditDialog";
import { QuestionDeleteDialog } from "./question-delete-dialog/QuestionDeleteDialog";
import { QuestionAddToMockDialog } from "./question-addToMock-dialog/QuestionAddToMockDialog";

import { QuestionsDeleteDialog } from "./questions-delete-dialog/QuestionsDeleteDialog";
import { QuestionsFetchDialog } from "./questions-fetch-dialog/QuestionsFetchDialog";
import { QuestionsUpdateStateDialog } from "./questions-update-status-dialog/QuestionsUpdateStateDialog";
import { QuestionsUIProvider } from "./QuestionsUIContext";
import { QuestionsCard } from "./QuestionsCard";

export function QuestionsPage({ history }) {
  const dispatch = useDispatch();
  const questionsUIEvents = {
    newQuestionButtonClick: () => {
      history.push("/listening/fill-in-the-blanks/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/listening/fill-in-the-blanks/${id}/edit`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/listening/fill-in-the-blanks/${id}/delete`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/listening/fill-in-the-blanks/${id}/add-to-mock-test`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/listening/fill-in-the-blanks/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/listening/fill-in-the-blanks/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/listening/fill-in-the-blanks/updateStatus");
    },
  };

  return (
    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
        <Route path="/listening/fill-in-the-blanks/new">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/listening/fill-in-the-blanks");
              }}
            />
          )}
        </Route>
        <Route path="/listening/fill-in-the-blanks/:id/edit">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/listening/fill-in-the-blanks");
              }}
            />
          )}
        </Route>
        <Route path="/listening/fill-in-the-blanks/:id/add-to-mock-test">
          {({ history, match }) => (
            <QuestionAddToMockDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/listening/fill-in-the-blanks");
              }}
            />
          )}
        </Route>
        <Route path="/listening/fill-in-the-blanks/deleteCustomers">
          {({ history, match }) => (
            <QuestionsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/listening/fill-in-the-blanks");
              }}
            />
          )}
        </Route>
        <Route path="/listening/fill-in-the-blanks/:id/delete">
          {({ history, match }) => (
            <QuestionDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/listening/fill-in-the-blanks");
              }}
            />
          )}
        </Route>
        <Route path="/listening/fill-in-the-blanks/fetch">
          {({ history, match }) => (
            <QuestionsFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/listening/fill-in-the-blanks");
              }}
            />
          )}
        </Route>
        <Route path="/listening/fill-in-the-blanks/updateStatus">
          {({ history, match }) => (
            <QuestionsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/listening/fill-in-the-blanks");
              }}
            />
          )}
        </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
