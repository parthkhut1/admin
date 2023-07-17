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
      history.push("/speaking/answer-short-question/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/speaking/answer-short-question/${id}/edit`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/speaking/answer-short-question/${id}/add-to-mock-test`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/speaking/answer-short-question/${id}/delete`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/speaking/answer-short-question/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/speaking/answer-short-question/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/speaking/answer-short-question/updateStatus");
    },
  };

  return (
    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
        <Route path="/speaking/answer-short-question/new">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/answer-short-question");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/answer-short-question/:id/edit">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/speaking/answer-short-question");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/answer-short-question/deleteCustomers">
          {({ history, match }) => (
            <QuestionsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/answer-short-question");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/answer-short-question/:id/add-to-mock-test">
          {({ history, match }) => (
            <QuestionAddToMockDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/answer-short-question");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/answer-short-question/:id/delete">
          {({ history, match }) => (
            <QuestionDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/speaking/answer-short-question");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/answer-short-question/fetch">
          {({ history, match }) => (
            <QuestionsFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/answer-short-question");
              }}
            />
          )}
        </Route>
        <Route path="/speaking/answer-short-question/updateStatus">
          {({ history, match }) => (
            <QuestionsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/speaking/answer-short-question");
              }}
            />
          )}
        </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
