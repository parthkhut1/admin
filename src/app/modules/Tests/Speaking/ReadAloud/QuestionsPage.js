import React from "react";
import { Route , Switch } from "react-router-dom";
import * as actions from "./_redux/questionsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { QuestionsLoadingDialog } from "./questions-loading-dialog/QuestionsLoadingDialog";
import { QuestionEditDialog } from "./question-edit-dialog/QuestionEditDialog";
import { QuestionAddToMockDialog } from "./question-addToMock-dialog/QuestionAddToMockDialog";

import { QuestionDeleteDialog } from "./question-delete-dialog/QuestionDeleteDialog";
import { QuestionsDeleteDialog } from "./questions-delete-dialog/QuestionsDeleteDialog";
import { QuestionsFetchDialog } from "./questions-fetch-dialog/QuestionsFetchDialog";
import { QuestionsUpdateStateDialog } from "./questions-update-status-dialog/QuestionsUpdateStateDialog";
import { QuestionsUIProvider } from "./QuestionsUIContext";
import { QuestionsCard } from "./QuestionsCard";

export function QuestionsPage({ history }) {
const dispatch = useDispatch();
  const questionsUIEvents = {
    newQuestionButtonClick: () => {
      history.push("/speaking/read-aloud/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/speaking/read-aloud/${id}/edit`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/speaking/read-aloud/${id}/add-to-mock-test`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/speaking/read-aloud/${id}/delete`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/speaking/read-aloud/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/speaking/read-aloud/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/speaking/read-aloud/updateStatus");
    },
  };

  return (
    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
        <Route path="/speaking/read-aloud/new">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/read-aloud");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/read-aloud/fetch">
          {({ history, match }) => (
            <QuestionsFetchDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/read-aloud");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/read-aloud/updateStatus">
          {({ history, match }) => (
            <QuestionsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/read-aloud");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/read-aloud/:id/edit">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/read-aloud");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/read-aloud/:id/add-to-mock-test">
          {({ history, match }) => (
            <QuestionAddToMockDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/read-aloud");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/read-aloud/deleteCustomers">
          {({ history, match }) => (
            <QuestionsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/read-aloud");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/read-aloud/:id/delete">
          {({ history, match }) => (
            <QuestionDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/read-aloud");
              }}
            />
          )}
        </Route>
      </Switch>

      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
