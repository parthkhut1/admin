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
      history.push("/writing/write-essay/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/writing/write-essay/${id}/edit`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/writing/write-essay/${id}/delete`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/writing/write-essay/${id}/add-to-mock-test`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/writing/write-essay/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/writing/write-essay/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/writing/write-essay/updateStatus");
    },
  };

  return (
    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
        <Route path="/writing/write-essay/new">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/writing/write-essay");
              }}
            />
          )}
        </Route>
        <Route path="/writing/write-essay/:id/edit">
          {({ history, match }) => (
            <QuestionEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                dispatch(actions.resetQuestion());

                history.push("/writing/write-essay");
              }}
            />
          )}
        </Route>
        <Route path="/writing/write-essay/:id/add-to-mock-test">
          {({ history, match }) => (
            <QuestionAddToMockDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/writing/write-essay");
              }}
            />
          )}
        </Route>
        <Route path="/writing/write-essay/deleteCustomers">
          {({ history, match }) => (
            <QuestionsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/writing/write-essay");
              }}
            />
          )}
        </Route>
        <Route path="/writing/write-essay/:id/delete">
          {({ history, match }) => (
            <QuestionDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/writing/write-essay");
              }}
            />
          )}
        </Route>
        <Route path="/writing/write-essay/fetch">
          {({ history, match }) => (
            <QuestionsFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/writing/write-essay");
              }}
            />
          )}
        </Route>
        <Route path="/writing/write-essay/updateStatus">
          {({ history, match }) => (
            <QuestionsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/writing/write-essay");
              }}
            />
          )}
        </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
