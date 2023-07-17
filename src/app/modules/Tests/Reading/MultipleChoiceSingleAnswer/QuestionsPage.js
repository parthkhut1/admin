import React from "react";
import { Route , Switch } from "react-router-dom";
import * as actions from "./_redux/questionsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { QuestionsLoadingDialog } from "./questions-loading-dialog/QuestionsLoadingDialog";
import { QuestionEditDialog } from "./question-edit-dialog/QuestionEditDialog";
import {QuestionAddToMockDialog} from "./question-addToMock-dialog/QuestionAddToMockDialog"

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
      history.push("/reading/multiple-choice-single-answer/new");
    },
    openEditQuestionDialog: (id) => {
      history.push(`/reading/multiple-choice-single-answer/${id}/edit`);
    },
    openAddToMockDialog: (id) => {
      history.push(`/reading/multiple-choice-single-answer/${id}/add-to-mock-test`);
    },
    openDeleteQuestionDialog: (id) => {
      history.push(`/reading/multiple-choice-single-answer/${id}/delete`);
    },
    openDeleteQuestionsDialog: () => {
      history.push(`/reading/multiple-choice-single-answer/deleteCustomers`);
    },
    openFetchQuestionsDialog: () => {
      history.push(`/reading/multiple-choice-single-answer/fetch`);
    },
    openUpdateQuestionsStatusDialog: () => {
      history.push("/reading/multiple-choice-single-answer/updateStatus");
    }
  }

  return (

    <QuestionsUIProvider questionsUIEvents={questionsUIEvents}>
      <QuestionsLoadingDialog />
      <Switch>
      <Route path="/reading/multiple-choice-single-answer/new">
        {({ history, match }) => (
          <QuestionEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetQuestion());

              history.push("/reading/multiple-choice-single-answer");
            }}
          />
        )}
      </Route>
      <Route path="/reading/multiple-choice-single-answer/:id/edit">
        {({ history, match }) => (
          <QuestionEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              dispatch(actions.resetQuestion());

              history.push("/reading/multiple-choice-single-answer");
            }}
          />
        )}
      </Route>
      <Route path="/reading/multiple-choice-single-answer/:id/add-to-mock-test">
        {({ history, match }) => (
          <QuestionAddToMockDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/reading/multiple-choice-single-answer");
            }}
          />
        )}
      </Route>
      <Route path="/reading/multiple-choice-single-answer/deleteCustomers">
        {({ history, match }) => (
          <QuestionsDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/reading/multiple-choice-single-answer");
            }}
          />
        )}
      </Route>
      <Route path="/reading/multiple-choice-single-answer/:id/delete">
        {({ history, match }) => (
          <QuestionDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/reading/multiple-choice-single-answer");
            }}
          />
        )}
      </Route>
      <Route path="/reading/multiple-choice-single-answer/fetch">
        {({ history, match }) => (
          <QuestionsFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/reading/multiple-choice-single-answer");
            }}
          />
        )}
      </Route>
      <Route path="/reading/multiple-choice-single-answer/updateStatus">
        {({ history, match }) => (
          <QuestionsUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/reading/multiple-choice-single-answer");
            }}
          />
        )}
      </Route>
      </Switch>
      <QuestionsCard />
    </QuestionsUIProvider>
  );
}
