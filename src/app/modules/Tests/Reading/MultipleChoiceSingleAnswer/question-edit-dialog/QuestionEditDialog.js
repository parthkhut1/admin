import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import { QuestionEditDialogHeader } from "./QuestionEditDialogHeader";
import { QuestionEditForm } from "./QuestionEditForm";
import { useQuestionsUIContext } from "../QuestionsUIContext";
import { useSnackbar } from "notistack";

export function QuestionEditDialog({ id, show, onHide }) {
  // questions UI Context
  const { enqueueSnackbar } = useSnackbar();

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
      actionsLoading: state.multipleChoiceSingleAnswers.actionsLoading,
      questionForEdit: state.multipleChoiceSingleAnswers.questionForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting question by id
    dispatch(actions.fetchQuestion(id));
  }, [id, dispatch]);

  // server request for saving question
  const saveQuestion = (question, queryParams) => {
    const dto = {
      ...question,
      id,
      examQu: question.examQu,
    };

    if (!id) {
      if (!dto.title)
        return enqueueSnackbar("Please write a question title", {
          variant: "error",
        });
      if (!dto.question_data?.question) delete dto.question_data["question"];

      if (!dto.question_data?.text)
        return enqueueSnackbar("Please write a question text", {
          variant: "error",
        });

      if (dto.question_data?.options.length < 2)
        return enqueueSnackbar("Please write at least 2 question options", {
          variant: "error",
        });

      if (!dto.answer.answer)
        return enqueueSnackbar("Please select a question option", {
          variant: "error",
        });

      // server request for creating question
      dispatch(actions.createQuestion(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchQuestions(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    } else {
      if (dto.question_data?.options?.length < 2)
        return enqueueSnackbar("Please write at least 2 question options", {
          variant: "error",
        });

      if (!dto.answer?.answer)
        return enqueueSnackbar("Please select a question option", {
          variant: "error",
        });
      // server request for updating Question
      dispatch(actions.updateQuestion(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchQuestions(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <QuestionEditDialogHeader id={id} />
      <QuestionEditForm
        saveQuestion={saveQuestion}
        actionsLoading={actionsLoading}
        question={questionForEdit || questionsUIProps.initQuestion}
        onHide={onHide}
      />
    </Modal>
  );
}
