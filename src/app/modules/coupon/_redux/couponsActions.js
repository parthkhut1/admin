import * as requestFromServer from "./couponsCrud";
import { couponsSlice, callTypes } from "./couponsSlice";
import SnackbarUtils from "./../../../notistack";
import axios from "../../../axios";

const { actions } = couponsSlice;
export const resetCoupon = () => (dispatch) => {
  return dispatch(actions.couponFetched({ couponForEdit: undefined }));
};

export const fetchCoupons = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCoupons(queryParams)
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
        actions.couponsFetched({ totalCount, perPage, currentPage, entities })
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

export const fetchCoupon = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.couponFetched({ couponForEdit: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCouponById(id)
    .then((response) => {
      const {
        data: { payload: coupon },
      } = response;

      const scopeId = coupon?.effects?.data[0]?.effect_data?.scope_id;
      if (scopeId) fetchScope(scopeId)(dispatch);

      const tagIdsObj = coupon?.conditions?.data?.find(
        (i) => i.condition_type == "tags"
      );

      const usersObj = coupon?.conditions?.data?.find(
        (i) => i.condition_type == "users"
      );

      const newCoupon = {
        ...coupon,
        is_all: coupon?.effects?.data[0]?.effect_type == "all" ? true : false,
        is_public:
          coupon?.conditions?.data[0]?.condition_type == "public"
            ? true
            : false,
        tags: tagIdsObj ? tagIdsObj.condition_data?.tags : [],
      };

      // const usersId = coupon?.conditions?.data[0]?.

      dispatch(actions.couponFetched({ couponForEdit: newCoupon }));
      if (usersObj?.condition_data?.userIds?.length != 0)
        fetchUsers(usersObj?.condition_data?.userIds)(dispatch);
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

export const fetchUsers = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .fetchUsers(ids)
    .then(
      axios.spread((...responses) => {
        const users = responses.map((i) => i.data.payload);
        dispatch(actions.addUsersToCoupon({ users }));
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

export const deleteCoupon = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCoupon(id)
    .then((response) => {
      dispatch(actions.couponDeleted({ id }));
      SnackbarUtils.success("Coupon deleted Successfully!");
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

export const createCoupon = (couponForCreation, queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createCoupon(couponForCreation)
    .then((response) => {
      const { coupon } = response.data;
      dispatch(actions.couponCreated({ coupon }));
      SnackbarUtils.success("Coupon created Successfully!");
      fetchCoupons(queryParams)(dispatch);
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

export const createScope = (info, queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createScope(info)
    .then((response) => {
      const { payload: scope } = response.data;
      const newCoupon = { ...info };
      newCoupon["scope_id"] = scope.id;
      createCoupon(newCoupon, queryParams)(dispatch);
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

export const updateCoupon = (coupon) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateCoupon(coupon)
    .then(() => {
      dispatch(actions.couponUpdated({ coupon }));
      SnackbarUtils.success("Coupon updated Successfully!");
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

export const updateCouponsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForCoupons(ids, status)
    .then(() => {
      dispatch(actions.couponsStatusUpdated({ ids, status }));
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

export const deleteCoupons = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCoupons(ids)
    .then(() => {
      dispatch(actions.couponsDeleted({ ids }));
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

export const fetchFilteredUsers = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilterOnUsers(queryParams)
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
        actions.filteredUsersFetched({
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

export const resetFilteredUsers = () => (dispatch) => {
  dispatch(actions.resetFilteredUsersFetched());
};

export const resetUserFetched2 = () => (dispatch) => {
  dispatch(actions.resetUserFetched());
};

export const fetchUser = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getUserById(id)
    .then((response) => {
      const {
        data: { payload: user },
      } = response;

      dispatch(actions.userFetched({ user }));
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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export const addTagToScope = (scopeId, ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .addTags(scopeId, ids)
    .then(() => {
      // fetchScopes({
      //   pageNumber: 1,
      //   pageSize: 10,
      //   sortField: "id",
      //   filter: {},
      // })(dispatch);
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
      // fetchScopes({
      //   pageNumber: 1,
      //   pageSize: 10,
      //   sortField: "id",
      //   filter: {},
      // })(dispatch);
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
      // fetchScopes({
      //   pageNumber: 1,
      //   pageSize: 10,
      //   sortField: "id",
      //   filter: {},
      // })(dispatch);
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
      // fetchScopes({
      //   pageNumber: 1,
      //   pageSize: 10,
      //   sortField: "id",
      //   filter: {},
      // })(dispatch);
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
export const resetFilteredPackages = () => (dispatch) => {
  dispatch(actions.resetFilteredPackagesFetched());
};
export const resetScope = () => (dispatch) => {
  dispatch(actions.resetScopeFetched());
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

export const fetchFilteredPackages = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .applyFilterOnPackage(queryParams)
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
        actions.filteredPackagesFetched({
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
