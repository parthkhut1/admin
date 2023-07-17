import * as requestFromServer from "./mockTestsCrud";
import { mockTestsSlice, callTypes } from "./mockTestsSlice";
import SnackbarUtils from "./../../../notistack";

const { actions } = mockTestsSlice;

export const fetchMockTests = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findMockTests(queryParams)
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
        actions.mockTestsFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            totalDuration:
              e.durations.speaking +
              e.durations.writing +
              e.durations.reading +
              e.durations.listening,
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

export const resetFilteredQuestions = () => (dispatch) => {
  dispatch(actions.resetFilteredQuestionsFetched());
};

export const fetchFilteredQuestions = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilter(queryParams)
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
      dispatch(actions.catchError({ error , callType: callTypes.list }));
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

export const fetchMockTest = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.mockTestFetched({ mockTestForEdit: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getMockTestById(id)
    .then((response) => {
      const { payload } = response.data;
      dispatch(actions.mockTestFetched({ mockTestForEdit: payload }));
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

export const deleteMockTest = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteMockTest(id)
    .then((response) => {
      dispatch(actions.mockTestDeleted({ id }));
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

export const createMockTest = (mockTestForCreation) => (dispatch) => {
  const newMockTestForCreation = {
    ...mockTestForCreation,
  };
  if (!newMockTestForCreation.published_at)
    delete newMockTestForCreation["published_at"];
  else {
    for (const [key, value] of Object.entries(
      newMockTestForCreation.counters
    )) {
      if (value == 0)
        return SnackbarUtils.error(
          "For publishing, mock tests must have at least 1 question in each skill."
        );
    }
  }
  dispatch(actions.startCall({ callType: callTypes.action }));

  if (
    Object.keys(mockTestForCreation.types).length === 0 &&
    mockTestForCreation.types.constructor === Object
  ) {
    return requestFromServer
      .createMockTest(newMockTestForCreation)
      .then((response) => {
        const { payload: mockTest } = response.data;

        dispatch(actions.mockTestCreated({ mockTest }));
        dispatch(actions.mockTestFetched({ mockTestForEdit: mockTest }));

        SnackbarUtils.success("Mock test created Successfully!");
      })
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        throw error;
      });
  } else {
    return requestFromServer
      .createMockTestRandomly(newMockTestForCreation)
      .then((response) => {
        const { payload: mockTest } = response.data;
        dispatch(actions.mockTestCreated({ mockTest }));
        dispatch(actions.mockTestFetched({ mockTestForEdit: mockTest }));
        SnackbarUtils.success("Mock test created Successfully!");
      })
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        throw error;
      });
  }
};

export const updateMockTest = (mockTest) => (dispatch) => {
  const newMockTest = {
    ...mockTest,
  };
  if (!newMockTest.published_at) delete newMockTest["published_at"];
  else {
    for (const [key, value] of Object.entries(newMockTest.counters)) {
      console.log(key, value);
      if (value == 0) {
        dispatch(actions.catchError({ callType: "action" }));
        return SnackbarUtils.error(
          "For publishing, mock tests must have at least 1 question in each skill."
        );
      }
    }
  }
  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer
    .updateMockTest(newMockTest)
    .then(() => {
      dispatch(actions.mockTestUpdated({ mockTest }));
      if (!mockTest.published_at) {
        return requestFromServer
          .togglePublishState(mockTest.id)
          .then(() => {
            //
          })
          .catch((error) => {
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

export const addQuestionToMockTest = (mockTestId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addQuestionsToMockTest(mockTestId, ids)
    .then((response) => {
      fetchMockTest(mockTestId)(dispatch);
      dispatch(actions.catchError("action"));
      SnackbarUtils.success("Questions added to mock test Successfully!");
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

export const updateMockTestsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForMockTests(ids, status)
    .then(() => {
      dispatch(actions.mockTestsStatusUpdated({ ids, status }));
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

export const deleteMockTests = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteMockTests(ids)
    .then(() => {
      dispatch(actions.mockTestsDeleted({ ids }));
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

export const resetMockTest = () => (dispatch) => {
  dispatch(actions.mockTestFetched({ mockTestForEdit: undefined }));
  dispatch(actions.questionsFetched({ entities: [] }));
};

export const sortMockTestQuestions = (
  mockTestId,
  questionId,
  destinationId
) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .sortMockTestQuestions(mockTestId, questionId, destinationId)
    .then(() => {
      dispatch(actions.catchError({ callType: callTypes.list }));
    })
    .catch((error) => {
      dispatch(actions.catchError({ callType: callTypes.list }));
      throw error;
    });
};

export const getMockTestQuestions = (mockTestId) => (dispatch) => {
  if (!mockTestId) {
    return dispatch(actions.questionsFetched({ entities: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getSkillsQuestions(mockTestId)
    .then((response) => {
      const {
        payload: { data },
      } = response.data;
      dispatch(actions.questionsFetched({ entities: data }));
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

export const deleteQuestion = (mockTestId, questionId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .removeQuestion(mockTestId, questionId)
    .then((response) => {
      getMockTestQuestions(mockTestId)(dispatch);
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
