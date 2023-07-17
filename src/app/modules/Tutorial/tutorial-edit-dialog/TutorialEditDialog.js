import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/tutorialsActions";
import { TutorialEditDialogHeader } from "./TutorialEditDialogHeader";
import { TutorialEditForm } from "./TutorialEditForm";
import { useTutorialsUIContext } from "../TutorialsUIContext";
import { useSnackbar } from "notistack";

export function TutorialEditDialog({ id, show, onHide }) {
  // tutorials UI Context
  const { enqueueSnackbar } = useSnackbar();
  const [postQuestion, setPostQuestion] = useState({});

  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      initTutorial: tutorialsUIContext.initTutorial,
    };
  }, [tutorialsUIContext]);

  // tutorials Redux state
  const dispatch = useDispatch();
  const { actionsLoading, tutorialForEdit, posts } = useSelector(
    (state) => ({
      actionsLoading: state.tutorials.actionsLoading,
      tutorialForEdit: state.tutorials.tutorialForEdit,
      posts: state.tutorials.posts,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting tutorial by id
    dispatch(actions.fetchTutorial(id));
  }, [id, dispatch]);

  useEffect(() => {
    // server call for getting tutorial by id
    if (posts) setPostQuestion(() => posts?.find((i) => i.is_featured == 1));
  }, [posts]);
  useEffect(() => {
    setPostQuestion({});
  }, [onHide]);

  // server request for saving tutorial
  const saveTutorial = (tutorial, queryParams) => {
    // console.log("tutorial>>>>>>>>>>>>>>>", tutorial);

    if (!id) {
      // if(!tutorial.name) return enqueueSnackbar("Please write a name.", { variant: "error" });
      // if(!tutorial.description) return enqueueSnackbar("Please write a description.", { variant: "error" });
      // if(!tutorial.teacher) return enqueueSnackbar("Please select a teacher.", { variant: "error" });

      // server request for creating tutorial
      dispatch(actions.createTutorial(tutorial)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchTutorials(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating tutorial
      dispatch(actions.updateTutorial(tutorial)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchTutorials(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <TutorialEditDialogHeader id={id} />
      <TutorialEditForm
        saveTutorial={saveTutorial}
        actionsLoading={actionsLoading}
        // tutorial={{...tutorialForEdit,...postQuestion} || tutorialsUIProps.initTutorial}
        tutorial={
          postQuestion &&
          !(
            Object.keys(postQuestion).length === 0 &&
            postQuestion.constructor === Object
          )
            ? { ...tutorialForEdit, ...postQuestion }
            : tutorialsUIProps.initTutorial
        }
        onHide={onHide}
      />
    </Modal>
  );
}
