import * as requestFromServer from "./tutorialsCrud";
import { tutorialsSlice, callTypes } from "./tutorialsSlice";
import { format, parseISO } from "date-fns";
import SnackbarUtils from "./../../../notistack";


const { actions } = tutorialsSlice;

export const resetTutorial = () => (dispatch) => {
  return dispatch(actions.tutorialFetched({ tutorialForEdit: null }));
};

export const fetchTutorials = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .findTutorials(queryParams)
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
        actions.tutorialsFetched({
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
export const fetchTutorialPosts = (tutorialId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .fetchTutorialPosts(tutorialId)
    .then((response) => {
      const {
        payload: {
          data: posts,
          meta: {
            pagination: { total: totalCount },
          },
        },
      } = response.data;

      dispatch(
        actions.postsFetched({
          posts,
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

export const fetchTutorial = (tutorialId) => (dispatch) => {
  if (!tutorialId) {
    return dispatch(actions.tutorialFetched({ tutorialForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getTutorialById(tutorialId)
    .then((response) => {
      const {
        data: { payload: tutorial },
      } = response;
      dispatch(actions.tutorialFetched({ tutorialForEdit: tutorial }));
      fetchTutorialPosts(tutorialId)(dispatch);
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

export const deleteTutorial = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteTutorial(id)
    .then((response) => {
      dispatch(actions.tutorialDeleted({ id }));
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
      dispatch(actions.postDeleted({ id }));
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

export const resetPosts = () => (dispatch) => {
  dispatch(actions.postsReset());
};

export const createTutorial = (tutorialForCreation) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createTutorial(tutorialForCreation.name)
    .then((response) => {
      const { payload: tutorial } = response.data;
      dispatch(actions.tutorialCreated({ tutorial }));
      const post={...tutorialForCreation};
      post["post_category_id"] = tutorial.id;
      post["is_featured"] = 1;
      delete post["name"];
      createPost(post)(dispatch);
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

export const createPost = (post) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createPost(post)
    .then((response) => {
      const { payload: post } = response.data;
      dispatch(actions.postCreated({ post }));
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

export const updateTutorial = (tutorial) => (dispatch) => {
  const newTutorial = {
    id : tutorial.category.id,
    name : tutorial.name
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateTutorial(newTutorial)
    .then(() => {
      dispatch(actions.tutorialUpdated({ tutorial }));
      const post = {
        id : tutorial.id,
        question_id: tutorial?.question_id,
        text:tutorial.text,
        title: tutorial.title,
      }
      updatePost(post)(dispatch);
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
      dispatch(actions.postUpdated({ post }));
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

export const updateTutorialsStatus = (ids, status) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateStatusForTutorials(ids, status)
    .then(() => {
      dispatch(actions.tutorialsStatusUpdated({ ids, status }));
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

export const deleteTutorials = (ids) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteTutorials(ids)
    .then(() => {
      dispatch(actions.tutorialsDeleted({ ids }));
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
