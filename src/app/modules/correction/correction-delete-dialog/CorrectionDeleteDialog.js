import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";
import * as actions from "../_redux/correctionsActions";
import {useCorrectionsUIContext} from "../CorrectionsUIContext";

export function CorrectionDeleteDialog({ id, show, onHide }) {
  // corrections UI Context
  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      setIds: correctionsUIContext.setIds,
      queryParams: correctionsUIContext.queryParams
    };
  }, [correctionsUIContext]);

  // corrections Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.corrections.actionsLoading }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!id) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteCorrection = () => {
    // server request for deleting correction by id
    dispatch(actions.deleteCorrection(id)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchCorrections(correctionsUIProps.queryParams));
      // clear selections list
      correctionsUIProps.setIds([]);
      // closing delete modal
      onHide();
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
          Correction Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete this correction?</span>
        )}
        {isLoading && <span>Correction is deleting...</span>}
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
            onClick={deleteCorrection}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
