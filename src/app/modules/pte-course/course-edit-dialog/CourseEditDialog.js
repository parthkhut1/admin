import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/coursesActions";
import { CourseEditDialogHeader } from "./CourseEditDialogHeader";
import { CourseEditForm } from "./CourseEditForm";
import { useCoursesUIContext } from "../CoursesUIContext";
import { useSnackbar } from "notistack";


export function CourseEditDialog({ id, show, onHide }) {
  // courses UI Context
  const { enqueueSnackbar } = useSnackbar();

  const coursesUIContext = useCoursesUIContext();
  const coursesUIProps = useMemo(() => {
    return {
      initCourse: coursesUIContext.initCourse,
    };
  }, [coursesUIContext]);

  // courses Redux state
  const dispatch = useDispatch();
  const { actionsLoading, courseForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.courses.actionsLoading,
      courseForEdit: state.courses.courseForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting course by id
    dispatch(actions.fetchCourse(id));
  }, [id, dispatch]);

  // server request for saving course
  const saveCourse = (course, queryParams) => {
    const dto = {
      ...course,
      id,
    };
    if (!id) {
      if (!course.title)
        return enqueueSnackbar("Please write a title.", { variant: "error" });
      if (course.questions && course.questions.length == 0)
        return enqueueSnackbar("Please add questions.", { variant: "error" });
      if (!course.content)
        return enqueueSnackbar("Please add content.", { variant: "error" });

      // server request for creating course
      dispatch(actions.createCourse(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCourses(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating course
      dispatch(actions.updateCourse(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCourses(queryParams)).then(() => {
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
      <CourseEditDialogHeader id={id} />
      <CourseEditForm
        saveCourse={saveCourse}
        actionsLoading={actionsLoading}
        course={courseForEdit || coursesUIProps.initCourse}
        onHide={onHide}
      />
    </Modal>
  );
}
