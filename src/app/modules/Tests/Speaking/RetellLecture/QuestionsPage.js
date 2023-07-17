import React from "react";
import { Route , Switch } from "react-router-dom";
import * as actions from "./_redux/questionsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { QuestionsLoadingDialog } from "./questions-loading-dialog/QuestionsLoadingDialog";
import { QuestionEditDialog } from "./question-edit-dialog/QuestionEditDialog";
import { QuestionDeleteDialog } from "./question-delete-dialog/QuestionDeleteDialog";
import { QuestionsDeleteDialog } from "./questions-delete-dialog/QuestionsDeleteDialog";
import { QuestionAddToMockDialog } from "./question-addToMock-dialog/QuestionAddToMockDialog";

import { QuestionsFetchDialog } from "./questions-fetch-dialog/QuestionsFetchDialog";
import { QuestionsUpdateStateDialog } from "./questions-update-status-dialog/QuestionsUpdateStateDialog";
import { QuestionsUIProvider } from "./QuestionsUIContext";
import { QuestionsCard } from "./QuestionsCard";

export function QuestionsPage({ history }) {
const dispatch = useDispatch();
  const questionsUIEvents = {
    newQuestionButtonClick: () => {
      history.push("/speaking/retell-lecture/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/speaking/retell-lecture/${id}/edit`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/speaking/retell-lecture/${id}/delete`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/speaking/retell-lecture/${id}/add-to-mock-test`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/speaking/retell-lecture/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/speaking/retell-lecture/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/speaking/retell-lecture/updateStatus");
    },
  };

  return (
    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
        <Route path="/speaking/retell-lecture/new">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/retell-lecture");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/retell-lecture/:id/edit">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/retell-lecture");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/retell-lecture/deleteCustomers">
          {({ history, match }) => (
            <QuestionsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/retell-lecture");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/retell-lecture/:id/add-to-mock-test">
          {({ history, match }) => (
            <QuestionAddToMockDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/retell-lecture");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/retell-lecture/:id/delete">
          {({ history, match }) => (
            <QuestionDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/retell-lecture");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/retell-lecture/fetch">
          {({ history, match }) => (
            <QuestionsFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/retell-lecture");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/retell-lecture/updateStatus">
          {({ history, match }) => (
            <QuestionsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/retell-lecture");
              }}
            />
          )}
        </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
