import * as requestFromServer from "./correctionsCrud";
import { correctionsSlice, callTypes } from "./correctionsSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";

const { actions } = correctionsSlice;

export const resetCorrection = () => (dispatch) => {
  return dispatch(actions.correctionFetched({ correctionForEdit: undefined }));
};

export const fetchCorrections = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCorrections(queryParams)
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
        actions.correctionsFetched({
          totalCount,
          perPage,
          currentPage,
          entities,
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

export const fetchCorrection = (correctionId) => (dispatch) => {
  if (!correctionId) {
    return dispatch(
      actions.correctionFetched({ correctionForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCorrectionById(correctionId)
    .then((response) => {
      const {
        data: { payload: correction },
      } = response;
      dispatch(actions.correctionFetched({ correctionForEdit: correction }));
      fetchQuestion(correction.question_id)(dispatch);
      // fetchUserAnswer(correction.id)(dispatch);
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

export const fetchQuestion = (questionId) => (dispatch) => {
  if (!questionId) {
    return dispatch(actions.questionFetched({ question: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getQuestionById(questionId)
    .then((response) => {
      const {
        data: { payload: question },
      } = response;
      dispatch(actions.questionFetched({ question: question }));
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

export const fetchUserAnswer = (answerId) => (dispatch) => {
  if (!answerId) {
    return dispatch(actions.userAnswerFetched({ question: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getUserAnswerById(answerId)
    .then((response) => {
      const {
        data: { payload: answer },
      } = response;
      dispatch(actions.userAnswerFetched({ userAnswer: answer }));
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

export const deleteCorrection = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCorrection(id)
    .then((response) => {
      dispatch(actions.correctionDeleted({ id }));
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

export const createCorrection = (correctionForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createCorrection(correctionForCreation)
    .then((response) => {
      const { correction } = response.data;
      dispatch(actions.correctionCreated({ correction }));
      SnackbarUtils.success("Answer was corrected manually.");
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

export const updateCorrection = (correction) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateCorrection(correction)
    .then(() => {
      dispatch(actions.correctionUpdated({ correction }));
      SnackbarUtils.success("Answer was corrected manually.");
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

export const updateCorrectionsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForCorrections(ids, status)
    .then(() => {
      dispatch(actions.correctionsStatusUpdated({ ids, status }));
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

export const deleteCorrections = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCorrections(ids)
    .then(() => {
      dispatch(actions.correctionsDeleted({ ids }));
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
