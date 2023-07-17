import React from "react";
import { Route , Switch } from "react-router-dom";
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
      history.push("/speaking/repeat-sentence/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/speaking/repeat-sentence/${id}/edit`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/speaking/repeat-sentence/${id}/add-to-mock-test`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/speaking/repeat-sentence/${id}/delete`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/speaking/repeat-sentence/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/speaking/repeat-sentence/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/speaking/repeat-sentence/updateStatus");
    },
  };

  return (
    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
        <Route path="/speaking/repeat-sentence/new">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/repeat-sentence");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/repeat-sentence/:id/edit">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/repeat-sentence");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/repeat-sentence/deleteCustomers">
          {({ history, match }) => (
            <QuestionsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/repeat-sentence");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/repeat-sentence/:id/add-to-mock-test">
          {({ history, match }) => (
            <QuestionAddToMockDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/repeat-sentence");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/repeat-sentence/:id/delete">
          {({ history, match }) => (
            <QuestionDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/repeat-sentence");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/repeat-sentence/fetch">
          {({ history, match }) => (
            <QuestionsFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/repeat-sentence");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/repeat-sentence/updateStatus">
          {({ history, match }) => (
            <QuestionsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/repeat-sentence");
              }}
            />
          )}
        </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
