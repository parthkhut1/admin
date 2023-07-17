import * as requestFromServer from "./reportsCrud";
import { reportsSlice, callTypes } from "./reportsSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "../../../notistack";

const { actions } = reportsSlice;

export const resetReport = () => (dispatch) => {
  return dispatch(actions.reportFetched({ reportForEdit: undefined }));
};

export const fetchReports = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findReports(queryParams)
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
        actions.reportsFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            exam_date: format(new Date(e.exam_date), "yyyy-MM-dd"),
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

export const fetchReport = (report) => (dispatch) => {
  if (!report?.id) {
    return dispatch(actions.reportFetched({ reportForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getReportById(report)
    .then((response) => {
      const {
        data: { payload: report },
      } = response;
      dispatch(actions.reportFetched({ reportForEdit: report }));
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

export const deleteReport = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteReport(id)
    .then((response) => {
      dispatch(actions.reportDeleted({ id }));
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

export const createReport = (reportForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createReport(reportForCreation)
    .then((response) => {
      const { report } = response.data;
      dispatch(actions.reportCreated({ report }));
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

export const updateReport = (report) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateReport(report)
    .then(() => {
      dispatch(actions.reportUpdated({ report }));
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

export const updateReportsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForReports(ids, status)
    .then(() => {
      dispatch(actions.reportsStatusUpdated({ ids, status }));
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

export const deleteReports = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteReports(ids)
    .then(() => {
      dispatch(actions.reportsDeleted({ ids }));
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

export const fetchQuestionById = (questionId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getQuestionById(questionId)
    .then((response) => {
      const {
        data: { payload: question },
      } = response;
      dispatch(actions.questionFetched({ question }));
      dispatch(actions.catchError({ callType: callTypes.action }));
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

export const fetchExportList = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getExportList()
    .then(() => {
      dispatch(actions.catchError({ callType: callTypes.action }));
      SnackbarUtils.success("Please wait, downloading start now ...");
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
