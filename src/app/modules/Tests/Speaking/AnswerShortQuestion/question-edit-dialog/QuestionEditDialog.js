import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import { QuestionEditDialogHeader } from "./QuestionEditDialogHeader";
import { QuestionEditForm } from "./QuestionEditForm";
import { useQuestionsUIContext } from "../QuestionsUIContext";
import SnackbarUtils from "../../../../../notistack";

export function QuestionEditDialog({ id, show, onHide }) {
  // questions UI Context

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
      actionsLoading: state.answerShortQuestions.actionsLoading,
      questionForEdit: state.answerShortQuestions.questionForEdit,
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

    formData.append("question_type", "AnswerShortQuestion");

    if (!id) {
      if (!question.fileInput)
        return SnackbarUtils.error("Please upload question audios.");

      if (!question.question_meta.transcript)
        return SnackbarUtils.error("Please write question transcript.");

      if (question?.keywords?.length != 0) {
        question.keywords &&
          question.keywords.forEach((kw) =>
            formData.append("question_meta[keywords][]", kw)
          );
      }

      formData.append("question_media[audio][]", question.fileInput);

      formData.append("question_data[]", []);

      formData.append(
        "question_meta[transcript]",
        question.question_meta.transcript
      );

      const dto = {
        question: formData,
        examQu: question.examQu,
      };

      if (!question.answer?.answer_meta?.transcript)
        return SnackbarUtils.error("Please write model answer transcript.");
        
      // if (!question.sampleAnswerFile)
      //   return SnackbarUtils.error("Please upload model answer audio.");

      if (question.sampleAnswerFile) {
        dto["answer"] = { answer: question.sampleAnswerFile };
      }

      dto["answer"] = {
        ...dto["answer"],
        answer_meta: {
          transcript: question.answer?.answer_meta?.transcript
            ? question.answer?.answer_meta?.transcript
            : null,
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
      if (question.fileInput)
        formData.append("question_media[audio][]", question.fileInput);

      if (question?.keywords?.length != 0) {
        question.keywords &&
          question.keywords.forEach((kw) =>
            formData.append("question_meta[keywords][]", kw)
          );
      } else formData.append("question_meta[keywords][]", []);

      if (question.question_meta.transcript)
        formData.append(
          "question_meta[transcript]",
          question.question_meta.transcript
        );

      formData.append("_method", "PUT");

      const dto = {
        question: formData,
        id,
        examQu : question.examQu,
      };

      if (question.sampleAnswerFile) {
        dto["answer"] = { answer: question.sampleAnswerFile };
      }

      if (question.answer?.answer_meta?.transcript)
        dto["answer"] = {
          ...dto["answer"],
          answer_meta: {
            transcript: question.answer?.answer_meta?.transcript
              ? question.answer?.answer_meta?.transcript
              : null,
          },
        };

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
