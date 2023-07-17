import * as requestFromServer from "./categoriesCrud";
import { categoriesSlice, callTypes } from "./categoriesSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";


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

export const fetchTreeChild = (categoryId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getTreeChild(categoryId)
    .then((response) => {
      const {
        data: { payload: categories },
      } = response;
      addTreeChilds(categoryId, categories)(dispatch); //categoryId = parent_id
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

export const addTreeChilds = (categoryId, childs) => (dispatch) => {
  dispatch(actions.treeChildsAdd({ id: categoryId, childs }));
};
export const addTreeChild = (categoryId, child) => (dispatch) => {
  dispatch(actions.treeChildAdd({ id: categoryId, child }));
};
export const updateTreeChild = (categoryId, name) => (dispatch) => {
  dispatch(actions.treeChildUpdate({ id: categoryId, name }));
};
export const deleteTreeChild = (parentId, categoryId) => (dispatch) => {
  dispatch(actions.treeChildDelete({ parentId, id: categoryId }));
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
      // dispatch(actions.categoryCreated({ category }));
      addTreeChild(category.parent_id, category)(dispatch);
      SnackbarUtils.success("Category created successfully. Open category.");

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

export const resetTree = () => (dispatch) => {
  return dispatch(actions.resetTree());
};
