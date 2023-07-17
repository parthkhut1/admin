import * as requestFromServer from "./packagesCrud";
import { packagesSlice, callTypes } from "./packagesSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";
import axios from "../../../axios";

const { actions } = packagesSlice;

export const resetPackage = () => (dispatch) => {
  return dispatch(actions.packageFetched({ packageForEdit: undefined }));
};

export const resetUsersPackagesListFetched = () => (dispatch) => {
  return dispatch(actions.resetUsersPackagesListFetched());
};

export const fetchPackages = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findPackages(queryParams)
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
        actions.packagesFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            is_recommended: e.is_recommended ? "Yes" : "No",
            is_base: e.is_base ? "Yes" : "No",
            tags: e.tags.join(" "),
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

export const fetchPackage = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.packageFetched({ packageForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getPackageById(id)
    .then((response) => {
      const {
        data: { payload: dynamicPackage },
      } = response;

      const scopeIds = dynamicPackage?.scopes?.map((i) => i.scope.id);
      fetchScopesDetail(scopeIds, dynamicPackage)(dispatch);
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

export const deletePackage = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePackage(id)
    .then((response) => {
      dispatch(actions.packageDeleted({ id }));
      SnackbarUtils.success("Package deleted Successfully!");
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

export const createPackage = (packageForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createPackage(packageForCreation)
    .then((response) => {
      const { dynamicPackage } = response.data;
      dispatch(actions.packageCreated({ package: dynamicPackage }));
      SnackbarUtils.success("Package created Successfully!");

      fetchPackages({
        pageNumber: 1,
        pageSize: 10,
        sortField: "id",
        sortOrder: {},
        filter: {},
      })(dispatch);
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

const setLimitation = (type, data) => {
  switch (type) {
    case "questions":
      return {
        limit: data?.questionsLimitation,
        is_unlimited: data?.questionsLimitation === 0 ? 1 : 0,
      };
    case "mocks":
      return {
        limit: data?.mockTestsLimitation,
        is_unlimited: data?.mockTestsLimitation === 0 ? 1 : 0,
      };
    case "sessions":
      return {
        limit: data?.sessionsLimitation,
        is_unlimited: data?.sessionsLimitation === 0 ? 1 : 0,
      };
    case "courses":
      return {
        limit: data?.coursesLimitation,
        is_unlimited: data?.coursesLimitation === 0 ? 1 : 0,
      };
  }
};
export const createScopes = (packageForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (packageForCreation.type) {
    return requestFromServer
      .createScopes(packageForCreation)
      .then(
        axios.spread((...responses) => {
          const newPackage = {
            ...packageForCreation,
            rules: [
              ...packageForCreation.rules,
              ...responses.map((i) => ({
                scope_id: i.data.payload.id,
                logic: `${
                  i.data.payload.billable_type !== "sessions"
                    ? "grant-access"
                    : "pay"
                }`,
                is_unlimited: setLimitation(
                  i.data.payload.billable_type,
                  packageForCreation
                )?.is_unlimited,
                limit: setLimitation(
                  i.data.payload.billable_type,
                  packageForCreation
                )?.limit,
              })),
            ],
          };
          createPackage(newPackage)(dispatch);
        })
      )
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        throw error;
      });
  } else {
    return requestFromServer
      .createScope(packageForCreation)
      .then((response) => {
        const { payload: scope } = response.data;
        const newPackage = { ...packageForCreation };
        newPackage["rules"] = [
          {
            scope_id: scope.id,
            logic: "grant-access",
            is_unlimited: 1,
            limit: 0,
          },
        ];

        createPackage(newPackage)(dispatch);
      })
      .catch((error) => {
        dispatch(actions.catchError({ error }));
        throw error;
      });
  }
};
export const fetchScopesDetail = (scopeIds, dynamicPackage = {}) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getScopesById(scopeIds)
    .then(
      axios.spread((...responses) => {
        const newPackage = dynamicPackage;
        newPackage["billables"] = responses?.map((i) => {
          if (i?.data?.payload?.billable_type)
            return {
              ...i?.data?.payload?.billables,
              type: i?.data?.payload?.billable_type,
            };
          else return { tag: i?.data?.payload?.tags, type: "tags" };
        });
        dispatch(actions.packageFetched({ packageForEdit: newPackage }));
      })
    )
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

export const updatePackage = (dynamicPackage) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updatePackage(dynamicPackage)
    .then(() => {
      dynamicPackage &&
        dynamicPackage.tags &&
        dynamicPackage.tags.forEach((tagId) => {
          return requestFromServer.updatePackageTags(dynamicPackage.id, tagId);
        });

      dynamicPackage &&
        dynamicPackage.questions &&
        dynamicPackage.questions.forEach((tagId) => {
          return requestFromServer.updatePackagelimitations(
            dynamicPackage.id,
            "questions",
            tagId
          );
        });

      dynamicPackage &&
        dynamicPackage.sessions &&
        dynamicPackage.sessions.forEach((tagId) => {
          return requestFromServer.updatePackagelimitations(
            dynamicPackage.id,
            "sessions",
            tagId
          );
        });

      dynamicPackage &&
        dynamicPackage.mocks &&
        dynamicPackage.mocks.forEach((tagId) => {
          return requestFromServer.updatePackagelimitations(
            dynamicPackage.id,
            "mocks",
            tagId
          );
        });

      dispatch(actions.packageUpdated({ package: dynamicPackage }));
      SnackbarUtils.success("Package updated Successfully!");
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

export const updatePackagesStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForPackages(ids, status)
    .then(() => {
      dispatch(actions.packagesStatusUpdated({ ids, status }));
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

export const deletePackages = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePackages(ids)
    .then(() => {
      dispatch(actions.packagesDeleted({ ids }));
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

///////////////////////////////////
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
///////////////////////////////////////

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
/////////////////////////////////////////

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
      dispatch(actions.catchError({ error, callType: "list" }));
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
      dispatch(actions.catchError({ error, callType: "list" }));
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
      dispatch(actions.catchError({ error, callType: "list" }));
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

////////////////////////////////////////////////////////////////////////

export const fetchScopes = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .fetchScopes()
    .then((response) => {
      const {
        payload: { data: entities },
      } = response.data;

      dispatch(
        actions.scopesFetched({
          entities: entities,
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

export const fetchScope = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.scopeFetched({ scope: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getScopeById(id)
    .then((response) => {
      const {
        data: { payload: dynamicPackage },
      } = response;

      dispatch(actions.scopeFetched({ scope: dynamicPackage }));
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
//////////////////////////////
export const fetchAssistantsScopes = () => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAssistantsScopes()
    .then((response) => {
      const {
        payload: { data: entities },
      } = response.data;

      dispatch(
        actions.assistantsScopesFetched({
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

export const fetchUserPackagesList = (packageId, page) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getUserPackagesList(packageId, page)
    .then((response) => {
      const {
        payload: {
          data: entities,
          // meta: {
          //   pagination: { total_pages: totalPage },
          // },
        },
      } = response.data;

      dispatch(
        actions.usersPackagesListFetched({
          // totalPage,
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

export const fetchExportList = (packageId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getExportList(packageId)
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
