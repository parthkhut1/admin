import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/tutorialsActions";
import { useTutorialsUIContext } from "../TutorialsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function TutorialsDeleteDialog({ show, onHide }) {
  // tutorials UI Context
  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      ids: tutorialsUIContext.ids,
      setIds: tutorialsUIContext.setIds,
      queryParams: tutorialsUIContext.queryParams,
    };
  }, [tutorialsUIContext]);

  // tutorials Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.tutorials.actionsLoading }),
    shallowEqual
  );

  // if tutorials weren't selected we should close modal
  useEffect(() => {
    if (!tutorialsUIProps.ids || tutorialsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteTutorials = () => {
    // server request for deleting tutorial by selected ids
    dispatch(actions.deleteTutorials(tutorialsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchTutorials(tutorialsUIProps.queryParams)).then(
        () => {
          // clear selections list
          tutorialsUIProps.setIds([]);
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
          Tutorials Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected tutorials?</span>
        )}
        {isLoading && <span>Tutorial are deleting...</span>}
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
            onClick={deleteTutorials}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
