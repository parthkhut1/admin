import * as requestFromServer from "./questionsCrud";
import { questionsSlice, callTypes } from "./questionsSlice";

import React from "react";
import { Button } from "react-bootstrap";
import SnackbarUtils from "./../../../../../notistack";

import { format } from "date-fns";
const { actions } = questionsSlice;
export const resetQuestion = () => (dispatch) => {
  return dispatch(actions.questionFetched({ questionForEdit: undefined }));
};

export const fetchQuestions = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findQuestions(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: {
              total: totalCount,
              per_page: perPage,
              current_page: currentPage,
            },
          },
        },
      } = response.data;
      dispatch(
        actions.questionsFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            is_exam_q: e.report_counter === 0 ? "No" : "Yes",
            is_free_for_table: e.is_free === 0 ? "Paid" : "Free",
            tags: e.tags.join(),
          })),
        })
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};
export const addQuestionToMockTest = (entity) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addQuestionToMockTest(entity)
    .then((response) => {
      SnackbarUtils.success("Question added to mock test Successfully!");
      dispatch(actions.catchError({ error: "action" }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};

export const fetchQuestion = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.questionFetched({ questionForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getQuestionById(id)
    .then((response) => {
      const {
        data: { payload: question },
      } = response;
      question["examQu"] = question["report_counter"] == 0 ? false : true;
      return requestFromServer
        .getAcceptableAnswer(question.id)
        .then((response) => {
          const {
            data: {
              payload: { data: answer },
            },
          } = response;
          dispatch(
            actions.questionFetched({
              questionForEdit: { ...question, answer: { ...answer[0] } },
            })
          );
        });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};

export const deleteQuestion = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteQuestion(id)
    .then((response) => {
      dispatch(actions.questionDeleted({ id }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};
const initialSetExamQuestion = (questionId) => {
  return requestFromServer
    .getGeo()
    .then((response) => {
      const { payload } = response.data;
      const examQu = {
        question_id: questionId,
        country: payload.country,
        city: payload.city,
        exam_date: format(new Date(), "yyyy-MM-dd"),
        description: "description",
      };
      return requestFromServer
        .setExamQuestion(examQu)
        .then((response) => {})
        .catch((error) => {
          // dispatch(actions.catchError({ error }));
          throw error;
        });
    })
    .catch((error) => {
      // dispatch(actions.catchError({ error }));
      throw error;
    });
};

const updateExamQuestion = (questionId) => {
  return requestFromServer
    .getGeo()
    .then((response) => {
      const { payload } = response.data;
      const examQu = {
        question_id: questionId,
        country: payload.country,
        city: payload.city,
        exam_date: format(new Date(), "yyyy-MM-dd"),
        description: "description",
      };
      return requestFromServer
        .updateExamQuestion(examQu)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          // dispatch(actions.catchError({ error }));
          throw error;
        });
    })
    .catch((error) => {
      // dispatch(actions.catchError({ error }));
      throw error;
    });
};
export const createQuestion = (questionForCreation) => (dispatch) => {
  // customized
  const action = (key, formData, question) => (
    <>
      <Button
        variant="light"
        onClick={() => {
          requestFromServer
            .createAnswer(formData)
            .then((response) => {
              const {
                data: { payload: answer },
              } = response;
              dispatch(
                actions.questionCreated({ question: { ...question, answer } })
              );
              SnackbarUtils.success("Question created Successfully!");
            })
            .catch((error) => {
              SnackbarUtils.error(
                "Error occured!",
                (key) => action(key, formData, question),
                true
              );
              dispatch(actions.catchError({ error }));
              throw error;
            });
        }}
      >
        Retry
      </Button>
    </>
  );

  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer
    .createQuestion(questionForCreation.question)
    .then((response) => {
      const {
        data: { payload: question },
      } = response;
      if (questionForCreation.examQu) initialSetExamQuestion(question.id);

      if (!questionForCreation.answer.answer) {
        dispatch(actions.questionCreated({ question }));
      } else {
        console.log("questionForCreation", questionForCreation);
        const testAnswer = {
          question_id: question.id,
          is_default: 1,
          answer_meta: {
            corrects: questionForCreation.answer.answer_meta.corrects,
          },
          answer: questionForCreation.answer.answer,
        };
        return requestFromServer
          .createAnswer(testAnswer)
          .then((response) => {
            const {
              data: { payload: answer },
            } = response;
            dispatch(
              actions.questionCreated({ question: { ...question, answer } })
            );
            SnackbarUtils.success("Question created Successfully!");
          })
          .catch((error) => {
            SnackbarUtils.error(
              "Error occured!",
              (key) => action(key, testAnswer, question),
              true
            );
            dispatch(actions.catchError({ error }));
            throw error;
          });
      }
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};

export const updateQuestion = (question) => (dispatch) => {
  // customized
  const action = (key, formData, question) => (
    <>
      <Button
        variant="light"
        onClick={() => {
          requestFromServer
            .createAnswer(formData)
            .then((response) => {
              const {
                data: { payload: answer },
              } = response;
              dispatch(
                actions.questionCreated({ question: { ...question, answer } })
              );
              SnackbarUtils.success("Question update Successfully!");
            })
            .catch((error) => {
              SnackbarUtils.error(
                "Error occured!",
                (key) => action(key, formData, question),
                true
              );
              dispatch(actions.catchError({ error }));
              throw error;
            });
        }}
      >
        Retry
      </Button>
    </>
  );

  dispatch(actions.startCall({ callType: callTypes.action }));
  if (question.examQu) initialSetExamQuestion(question.id);

  if (!question.answer) {
    return requestFromServer
      .updateQuestion(question)
      .then(() => {
        dispatch(actions.questionUpdated({ question }));
      })
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        throw error;
      });
  } else {
    return requestFromServer
      .getAcceptableAnswer(question.id)
      .then((response) => {
        const {
          data: {
            payload: { data: answer },
          },
        } = response;

        const testAnswer = {
          question_id: question.id,
          is_default: 1,
          answer_meta: {
            corrects: question.answer.answer_meta.corrects,
          },
          answer: question.answer.answer,
        };
        //yani tahala javabi nadashte va to update mikhad taze javab tolid kone.
        if (answer.length == 0) {
          return requestFromServer
            .createAnswer(testAnswer)
            .then((response) => {
              const {
                data: { payload: answer },
              } = response;
              dispatch(
                actions.questionCreated({ question: { ...question, answer } })
              );
              SnackbarUtils.success("Question updated Successfully!");
            })
            .catch((error) => {
              SnackbarUtils.error(
                "Error occured!",
                (key) => action(key, testAnswer, question),
                true
              );
              dispatch(actions.catchError({ error }));
              throw error;
            });
        }

        return requestFromServer
          .updateQuestion(question)
          .then((response) => {
            return requestFromServer
              .updateAnswer(answer[0].id, testAnswer)
              .then((response) => {
                const {
                  data: { payload: answer1 },
                } = response;
                dispatch(
                  actions.questionUpdated({
                    question: { ...question, answer1 },
                  })
                );
                SnackbarUtils.success("Question updated Successfully!");
              })
              .catch((error) => {
                dispatch(actions.catchError({ error }));
                SnackbarUtils.error("Error occured, try again.");

                throw error;
              });
          })
          .catch((error) => {
            dispatch(actions.catchError({ error }));
            SnackbarUtils.error("Error occured, try again.");

            throw error;
          });
      })
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        SnackbarUtils.error("Error occured, try again.");

        throw error;
      });
  }
};

export const updateQuestionsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForQuestions(ids, status)
    .then(() => {
      dispatch(actions.questionStatusUpdated({ ids, status }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};

export const deleteQuestions = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteQuestions(ids)
    .then(() => {
      dispatch(actions.questionsDeleted({ ids }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error }));
            if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      )
        SnackbarUtils.error(error.response.data.message);
      throw error;
    });
};
