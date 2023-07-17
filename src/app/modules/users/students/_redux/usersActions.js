import * as requestFromServer from "./usersCrud";
import { usersSlice, callTypes } from "./usersSlice";
import SnackbarUtils from "./../../../../notistack";
import moment from "moment";

const { actions } = usersSlice;

export const resetUser = () => (dispatch) => {
  return dispatch(actions.userFetched({ userForEdit: undefined }));
};

export const fetchUsers = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findUsers(queryParams)
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
        actions.usersFetched({
          totalCount,
          perPage,
          currentPage,
          entities: entities.map((e) => ({
            ...e,
            tags: e.tags.join(),
            created_at: moment(e.created_at, "YYYY-MM-DD").format("YYYY-MM-DD"),
            date_of_exam: `${
              e.date_of_exam
                ? moment(e.date_of_exam, "YYYY-MM-DD").format("YYYY-MM-DD")
                : "-"
            }`,
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

export const fetchUser = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.userFetched({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getUserById(id)
    .then((response) => {
      const {
        data: { payload: user },
      } = response;

      dispatch(actions.userFetched({ userForEdit: user }));
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

export const deleteUser = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteUser(id)
    .then((response) => {
      dispatch(actions.userDeleted({ id }));
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

export const createUser = (userForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createUser(userForCreation)
    .then((response) => {
      const {
        data: { payload: user },
      } = response;
      dispatch(actions.userCreated({ user }));
      SnackbarUtils.success("Student created successfully.");
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

export const updateUser = (user) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateUser(user)
    .then(() => {
      dispatch(actions.userUpdated({ user }));
      SnackbarUtils.success("Student updated successfully.");
      if (user.password) resetPassword(user)(dispatch);
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

export const resetPassword = (user) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .resetUserPassword(user)
    .then(() => {
      dispatch(actions.catchError({ callTypes: "action" }));
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

export const updateUsersStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForUsers(ids, status)
    .then(() => {
      dispatch(actions.usersStatusUpdated({ ids, status }));
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

export const activeAndDeactiveUser = (userId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .activeAndDeactive(userId)
    .then((response) => {
      const {
        payload: { is_deactivated },
      } = response.data;
      dispatch(actions.catchError({ callType: "action" }));
      if (is_deactivated)
        SnackbarUtils.success("Student deavtived successfully.");
      else SnackbarUtils.success("Student actived successfully.");

      fetchUser(userId)(dispatch);
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

export const deleteUsers = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteUsers(ids)
    .then(() => {
      dispatch(actions.usersDeleted({ ids }));
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

export const fetchUserPackagesList = (userId, page = 1) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getUserPackagesList(userId, page)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total_pages: totalPage },
          },
        },
      } = response.data;

      dispatch(
        actions.userPackagesListFetched({
          entities,
          totalPage,
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

export const assignPackage = (data) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .assignPackage(data)
    .then((response) => {
      const { payload: userPackage } = response.data;
      pay(userPackage.payable_id, data.userId)(dispatch);
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

export const pay = (payableId, userId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .pay(payableId)
    .then((response) => {
      fetchUserPackagesList(userId)(dispatch);
      SnackbarUtils.success("Package assigned to user successfully.");
      dispatch(actions.catchError({ callTypes: "action" }));
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

export const fetchStatistics = (userId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getUserStatistics(userId)
    .then((response) => {
      const {
        data: { payload: statistics },
      } = response;
      console.log("statistics$$$", statistics);
      dispatch(actions.statisticsFetched({ statistics }));
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

export const fetchLoginHistory = (userId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getLoginHistory(userId)
    .then((response) => {
      const {
        payload: { data: history },
      } = response.data;
      dispatch(actions.historyFetched({ history }));
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

export const userPackageCancelation = (packageId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .packageCancelation(packageId)
    .then((response) => {
      SnackbarUtils.success("Package canceled successfully.");
      dispatch(actions.removePackageFromUserPackagesList({packageId}));
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

export const guestLoginAction = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .guestLogin(body)
    .then((response) => {
      const {
        payload: { data: history },
      } = response.data;
      dispatch(actions.historyFetched({ history }));
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
