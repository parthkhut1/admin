import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/coursesActions";
import { useCoursesUIContext } from "../CoursesUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function CoursesDeleteDialog({ show, onHide }) {
  // courses UI Context
  const coursesUIContext = useCoursesUIContext();
  const coursesUIProps = useMemo(() => {
    return {
      ids: coursesUIContext.ids,
      setIds: coursesUIContext.setIds,
      queryParams: coursesUIContext.queryParams,
    };
  }, [coursesUIContext]);

  // courses Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.courses.actionsLoading }),
    shallowEqual
  );

  // if courses weren't selected we should close modal
  useEffect(() => {
    if (!coursesUIProps.ids || coursesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteCourses = () => {
    // server request for deleting course by selected ids
    dispatch(actions.deleteCourses(coursesUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchCourses(coursesUIProps.queryParams)).then(
        () => {
          // clear selections list
          coursesUIProps.setIds([]);
          // closing delete modal
          onHide();
        }
      );
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {isLoading && <ModalProgressBar />}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          courses Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected courses?</span>
        )}
        {isLoading && <span>course are deleting...</span>}
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={deleteCourses}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
