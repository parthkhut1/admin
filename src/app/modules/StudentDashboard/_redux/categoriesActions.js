import * as requestFromServer from "./categoriesCrud";
import { categoriesSlice, callTypes } from "./categoriesSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "../../../notistack";

const { actions } = categoriesSlice;

export const resetCategory = () => (dispatch) => {
  return dispatch(actions.categoryFetched({ categoryForEdit: undefined }));
};

export const fetchCategories = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findCategories(queryParams)
    .then((response) => {
      const {
        payload: {
          data: entities,
          meta: {
            pagination: { total: totalCount },
          },
        },
      } = response.data;

      dispatch(
        actions.categoriesFetched({
          totalCount,
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

export const fetchCategory = (categoryId) => (dispatch) => {
  if (!categoryId) {
    return dispatch(actions.categoryFetched({ categoryForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCategoryById(categoryId)
    .then((response) => {
      const {
        data: { payload: category },
      } = response;
      dispatch(actions.categoryFetched({ categoryForEdit: category }));
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

export const deleteCategory = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCategory(id)
    .then((response) => {
      dispatch(actions.categoryDeleted({ id }));
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

export const createCategory = (categoryForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createCategory(categoryForCreation)
    .then((response) => {
      const { payload: category } = response.data;
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

export const updateCategory = (category) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateCategory(category)
    .then(() => {
      dispatch(actions.categoryUpdated({ category }));
      SnackbarUtils.success("Category updated successfully");
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

export const updateCategoriesStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForCategories(ids, status)
    .then(() => {
      dispatch(actions.categoriesStatusUpdated({ ids, status }));
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

export const deleteCategories = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCategories(ids)
    .then(() => {
      dispatch(actions.categoriesDeleted({ ids }));
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

////////////////////////////////////////////////////////////////////

export const createPost = (post) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createPost(post)
    .then((response) => {
      const { payload: post } = response.data;
      SnackbarUtils.success("Operation done successfully");
      dispatch(actions.catchError({ calltype: "action" }));
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
export const updatePost = (post) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updatePost(post)
    .then(() => {
      SnackbarUtils.success("Operation done successfully");
      dispatch(actions.catchError({ calltype: "action" }));
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
export const deletePost = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletePost(id)
    .then((response) => {
      SnackbarUtils.success("Operation done successfully");
      dispatch(actions.catchError({ calltype: "action" }));
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

export const fetchCategoryPosts = (categoryId, type) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getPosts(categoryId)
    .then((response) => {
      const {
        payload: { data },
      } = response.data;
      dispatch(
        actions.categoriesFetchPosts({
          data,
          type,
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

export const createPostLocaly = (post) => (dispatch) => {
  dispatch(actions.createPostLocaly({ post }));
};
export const updatePostLocaly = (post) => (dispatch) => {
  dispatch(actions.updatePostLocaly({ post }));
};
export const deletePostLocaly = (id) => (dispatch) => {
  dispatch(actions.deletePostLocaly({ id }));
};
