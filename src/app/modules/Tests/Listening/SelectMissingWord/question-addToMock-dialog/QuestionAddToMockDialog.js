import React, { useEffect, useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import { QuestionAddToMockDialogHeader } from "./QuestionAddToMockDialogHeader";
import { QuestionAddToMockForm } from "./QuestionAddToMockForm";
import { useQuestionsUIContext } from "../QuestionsUIContext";
import { useSnackbar } from "notistack";

export function QuestionAddToMockDialog({ id, show, onHide }) {
  // questions UI Context
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const questionsUIContext = useQuestionsUIContext();
  const questionsUIProps = useMemo(() => {
    return {
      initQuestion: questionsUIContext.initQuestion,
    };
  }, [questionsUIContext]);

  // questions Redux state
  const dispatch = useDispatch();
  const { actionsLoading, questionForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.readAlouds.actionsLoading,
      questionForEdit: state.readAlouds.questionForEdit,
    }),
    shallowEqual
  );

  // server request for saving question
  const saveQuestion = (question, queryParams) => {
    const dto = {
      ...question,
      id,
    };

    // server request for add Question To Mock Test
    dispatch(actions.addQuestionToMockTest(dto)).then(() => {
      // closing delete modal
      onHide();
    });
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <QuestionAddToMockDialogHeader id={id} />
      <QuestionAddToMockForm
        saveQuestion={saveQuestion}
        actionsLoading={actionsLoading}
        question={questionForEdit || questionsUIProps.initQuestion}
        onHide={onHide}
      />
    </Modal>
  );
}
