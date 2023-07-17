import * as requestFromServer from "./coursesCrud";
import { coursesSlice, callTypes } from "./coursesSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";

const { actions } = coursesSlice;

export const resetCourse = () => (dispatch) => {
  return dispatch(actions.courseFetched({ courseForEdit: undefined }));
};

export const fetchCourses = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCourses(queryParams)
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
        actions.coursesFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            published_at: `${format(
              new Date(e.published_at),
              "yyyy-MM-dd"
            )} , ${format(new Date(e.published_at), "HH:mm")}`,
            is_free: e.is_free ? "Free" : "Paid",
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

export const fetchCourse = (courseId) => (dispatch) => {
  if (!courseId) {
    return dispatch(actions.courseFetched({ courseForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCourseById(courseId)
    .then((response) => {
      const {
        data: { payload: course },
      } = response;
      dispatch(
        actions.courseFetched({
          courseForEdit: { ...course, parentNameLevel2: course.category?.name },
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

export const deleteCourse = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCourse(id)
    .then((response) => {
      dispatch(actions.courseDeleted({ id }));
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

export const createCourse = (courseForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createCourse(courseForCreation)
    .then((response) => {
      const { payload: course } = response.data;

      dispatch(actions.courseCreated({ course }));

      if (
        courseForCreation?.questions &&
        courseForCreation?.questions?.length != 0
      )
        addQuestionsToCourse(course.id, courseForCreation?.questions)(dispatch);
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

export const updateCourse = (course) => (dispatch) => {
  console.log("course", course);
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateCourse(course)
    .then(() => {
      if (
        course?.questions &&
        Array.isArray(course?.questions) &&
        course?.questions?.length != 0
      )
        addQuestionsToCourse(course.id, course?.questions)(dispatch);

      dispatch(actions.courseUpdated({ course }));
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

export const updateCoursesStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForCourses(ids, status)
    .then(() => {
      dispatch(actions.coursesStatusUpdated({ ids, status }));
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

export const deleteCourses = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCourses(ids)
    .then(() => {
      dispatch(actions.coursesDeleted({ ids }));
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

export const fetchCategoryChilds = (parentId, levelIndex) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getChilds(parentId)
    .then((response) => {
      const { payload: entities } = response.data;

      dispatch(
        actions.categoriesFetchChilds({
          entities,
          levelIndex,
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

export const resetLevel1 = () => (dispatch) => {
  return dispatch(actions.resetLevel1());
};

export const resetLevel2 = () => (dispatch) => {
  return dispatch(actions.resetLevel2());
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

export const fetchFilteredKnowledgeTest = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilterOnKnowledgeTest(queryParams)
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

export const addQuestionToMockTest = (mockTestId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addQuestionsToMockTest(mockTestId, ids)
    .then((response) => {
      fetchCourse(mockTestId)(dispatch);
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

export const resetFilteredQuestions = () => (dispatch) => {
  dispatch(actions.resetFilteredQuestionsFetched());
};

export const addQuestionsToCourse = (courseId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addQuestions(courseId, ids)
    .then(() => {
      fetchCourses({
        pageNumber: 1,
        pageSize: 10,
        sortField: "id",
        filter: {},
      })(dispatch);
      dispatch(actions.catchError({ error: "action" }));
      fetchCourse(courseId)(dispatch);
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

export const removeQuestionsFromCourse = (courseId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteQuestions(courseId, ids)
    .then(() => {
      fetchCourses({
        pageNumber: 1,
        pageSize: 10,
        sortField: "id",
        filter: {},
      })(dispatch);
      dispatch(actions.catchError({ error: "action" }));
      fetchCourse(courseId)(dispatch);
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

export const fetchTreeChild = (categoryId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getTreeChild(categoryId)
    .then((response) => {
      const {
        data: { payload: categories },
      } = response;
      //categoryId = parent_id
      if (categoryId === 0) dispatch(actions.setMainCatagories({ categories }));
      else dispatch(actions.setSubCatagories({ categories }));
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

export const fetchTreeChildLevel2 = (categoryId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getTreeChild(categoryId)
    .then((response) => {
      const {
        data: { payload: categories },
      } = response;
      //categoryId = parent_id
      dispatch(actions.setSubCatagoriesLevel3({ categories }));
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
