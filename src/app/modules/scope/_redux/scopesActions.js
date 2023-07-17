import * as requestFromServer from "./scopesCrud";
import { scopesSlice, callTypes } from "./scopesSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";


const { actions } = scopesSlice;

export const resetScope = () => (dispatch) => {
  return dispatch(actions.scopeFetched({ scopeForEdit: undefined }));
};

export const fetchScopes = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findScopes(queryParams)
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
        actions.scopesFetched({
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

export const fetchScopeBookingList = (scopeId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getScopeBookingList(scopeId)
    .then((response) => {
      const {
        payload: { data: entities },
      } = response.data;

      dispatch(
        actions.scopeBookingListFetched({
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

export const addBooking = (data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .addBooking(data)
    .then((response) => {
      fetchScopeBookingList(data.scope_id)(dispatch);
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

export const deleteBooking = (scopeId, bookingId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .deleteBooking(bookingId)
    .then((response) => {
      fetchScopeBookingList(scopeId)(dispatch);
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

export const fetchScope = (scopeId) => (dispatch) => {
  if (!scopeId) {
    return dispatch(actions.scopeFetched({ scopeForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getScopeById(scopeId)
    .then((response) => {
      const {
        data: { payload: scope },
      } = response;
      dispatch(actions.scopeFetched({ scopeForEdit: scope }));
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

export const deleteScope = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteScope(id)
    .then((response) => {
      dispatch(actions.scopeDeleted({ id }));
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

export const createScope = (scopeForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createScope(scopeForCreation)
    .then((response) => {
      const { scope } = response.data;
      dispatch(actions.scopeCreated({ scope }));
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

export const updateScope = (scope) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateScope(scope)
    .then(() => {
      dispatch(actions.scopeUpdated({ scope }));
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

export const updateScopesStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForScopes(ids, status)
    .then(() => {
      dispatch(actions.scopesStatusUpdated({ ids, status }));
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

export const deleteScopes = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteScopes(ids)
    .then(() => {
      dispatch(actions.scopesDeleted({ ids }));
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

////////////////////////////////////////////////////////////////////////////////////
//{ pageNumber, pageSize, sortField, sortOrder, filter }
export const addTagToScope = (scopeId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addTags(scopeId, ids)
    .then(() => {
      fetchScopes({
        pageNumber: 1,
        pageSize: 10,
        sortField: "id",
        filter: {},
      })(dispatch);
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

export const removeTagFromScope = (scopeId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteTags(scopeId, ids)
    .then(() => {
      fetchScopes({
        pageNumber: 1,
        pageSize: 10,
        sortField: "id",
        filter: {},
      })(dispatch);
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

export const addBillToScope = (scopeId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addBills(scopeId, ids)
    .then(() => {
      fetchScopes({
        pageNumber: 1,
        pageSize: 10,
        sortField: "id",
        filter: {},
      })(dispatch);
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

export const removeBillFromScope = (scopeId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteBills(scopeId, ids)
    .then(() => {
      fetchScopes({
        pageNumber: 1,
        pageSize: 10,
        sortField: "id",
        filter: {},
      })(dispatch);
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

/////////////////
export const fetchFilteredQuestions = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilterOnQuestion(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total: totalCount },
            pagination: { current_page },
          },
        },
      } = response.data;

      dispatch(
        actions.filteredQuestionsFetched({
          totalCount,
          current_page,
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

export const fetchFilteredSessions = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilterOnSession(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total: totalCount },
            pagination: { current_page },
          },
        },
      } = response.data;

      dispatch(
        actions.filteredSessionsFetched({
          totalCount,
          current_page,
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

export const fetchFilteredMocks = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilterOnMockTest(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total: totalCount },
            pagination: { current_page },
          },
        },
      } = response.data;

      dispatch(
        actions.filteredMocksFetched({
          totalCount,
          current_page,
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

export const fetchFilteredCourses = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilterOnCourse(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total: totalCount },
            pagination: { current_page },
          },
        },
      } = response.data;

      dispatch(
        actions.filteredCoursesFetched({
          totalCount,
          current_page,
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
export const resetFilteredQuestions = () => (dispatch) => {
  dispatch(actions.resetFilteredQuestionsFetched());
};
export const resetFilteredMocks = () => (dispatch) => {
  dispatch(actions.resetFilteredMocksFetched());
};
export const resetFilteredSessions = () => (dispatch) => {
  dispatch(actions.resetFilteredSessionsFetched());
};

export const resetFilteredCourses = () => (dispatch) => {
  dispatch(actions.resetFilteredCoursesFetched());
};
