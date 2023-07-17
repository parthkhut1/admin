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
      history.push("/reading/multiple-choice-multiple-answer/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/reading/multiple-choice-multiple-answer/${id}/edit`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/reading/multiple-choice-multiple-answer/${id}/delete`);
    },
    openAddToMockDialog: (id) => {
      history.push(
        `/reading/multiple-choice-multiple-answer/${id}/add-to-mock-test`
      );
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/reading/multiple-choice-multiple-answer/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/reading/multiple-choice-multiple-answer/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/reading/multiple-choice-multiple-answer/updateStatus");
    },
  };

  return (
    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
        <Route path="/reading/multiple-choice-multiple-answer/new">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/reading/multiple-choice-multiple-answer");
              }}
            />
          )}
        </Route>
        <Route path="/reading/multiple-choice-multiple-answer/:id/edit">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/reading/multiple-choice-multiple-answer");
              }}
            />
          )}
        </Route>
        <Route path="/reading/multiple-choice-multiple-answer/:id/add-to-mock-test">
          {({ history, match }) => (
            <QuestionAddToMockDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/reading/multiple-choice-multiple-answer");
              }}
            />
          )}
        </Route>
        <Route path="/reading/multiple-choice-multiple-answer/deleteCustomers">
          {({ history, match }) => (
            <QuestionsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/reading/multiple-choice-multiple-answer");
              }}
            />
          )}
        </Route>
        <Route path="/reading/multiple-choice-multiple-answer/:id/delete">
          {({ history, match }) => (
            <QuestionDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/reading/multiple-choice-multiple-answer");
              }}
            />
          )}
        </Route>
        <Route path="/reading/multiple-choice-multiple-answer/fetch">
          {({ history, match }) => (
            <QuestionsFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/reading/multiple-choice-multiple-answer");
              }}
            />
          )}
        </Route>
        <Route path="/reading/multiple-choice-multiple-answer/updateStatus">
          {({ history, match }) => (
            <QuestionsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/reading/multiple-choice-multiple-answer");
              }}
            />
          )}
        </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
