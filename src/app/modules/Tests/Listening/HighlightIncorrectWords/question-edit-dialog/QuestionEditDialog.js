import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import { QuestionEditDialogHeader } from "./QuestionEditDialogHeader";
import { QuestionEditForm } from "./QuestionEditForm";
import { useQuestionsUIContext } from "../QuestionsUIContext";
import { useSnackbar } from "notistack";
import SnackbarUtils from "./../../../../../notistack";

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
      actionsLoading: state.rwFillInTheBlanks.actionsLoading,
      questionForEdit: state.rwFillInTheBlanks.questionForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting question by id
    dispatch(actions.fetchQuestion(id));
  }, [id, dispatch]);

  // server request for saving question
  const saveQuestion = (question, queryParams) => {
    const formData = new FormData();
    Object.keys(question).forEach((key) => {
      if (typeof question[key] !== "object" && key !== "is_free")
        formData.append(key, question[key]);
      if (key === "is_free")
        formData.append(key, question[key] === true ? 1 : 0);
    });
    formData.append("question_type", "HighlightIncorrectWords");

    if (!id) {
      if (!question.fileInput)
        return SnackbarUtils.error("Please upload question audio.");

      // if (!question.question_meta.transcript)
      //   return SnackbarUtils.error("Please write question transcript.");

      if (question.question_data.text.length === 0)
        return SnackbarUtils.error("Please write question text");

      if (question.answer.answer.length === 0)
        return SnackbarUtils.error("Please select some words from text");

      if (question.answer.answer_meta.corrects.length !== question.answer.answer.length)
        return SnackbarUtils.error("Please write correct words for all.");

      formData.append("question_data[text]", question.question_data.text);

      formData.append("question_media[audio][]", question.fileInput);

      formData.append(
        "question_meta[transcript]",
        question.question_data.text
      );

      // formData.append("question_meta[keywords][]", "keyTest");

      const dto = {
        question: formData,
        examQu : question.examQu,

      };

      if (question?.answer?.answer.length != 0)
        dto["answer"] = { answer: question?.answer?.answer };

      if (question?.answer?.answer_meta?.corrects?.length != 0)
        dto["answer"] = {
          ...dto["answer"],
          answer_meta: {
            corrects: question?.answer?.answer_meta?.corrects,
          },
        };


      // server request for creating question
      dispatch(actions.createQuestion(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchQuestions(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    } else {
      if (question.question_data.text.length === 0)
        return SnackbarUtils.error("Please write question text");

      if (question.fileInput) {
        formData.append("question_media[audio][]", question.fileInput);
      }

      formData.append(
        "question_meta[transcript]",
        question.question_data.text
      );

      if (question.question_data.text)
        formData.append("question_data[text]", question.question_data.text);

      formData.append("_method", "PUT");

      const dto = {
        question: formData,
        id,
        examQu : question.examQu,
      };

      if (question?.answer?.answer.length != 0)
        dto["answer"] = { answer: question?.answer?.answer };
      else return SnackbarUtils.error("Please select some words from text");

      if (question?.answer?.answer_meta?.corrects?.length != 0)
        dto["answer"] = {
          ...dto["answer"],
          answer_meta: {
            corrects: question?.answer?.answer_meta?.corrects,
          },
        };
      else return SnackbarUtils.error("Please write correct words for all.");

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
