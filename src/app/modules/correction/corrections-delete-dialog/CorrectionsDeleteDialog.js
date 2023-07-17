import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/correctionsActions";
import { useCorrectionsUIContext } from "../CorrectionsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function CorrectionsDeleteDialog({ show, onHide }) {
  // corrections UI Context
  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      ids: correctionsUIContext.ids,
      setIds: correctionsUIContext.setIds,
      queryParams: correctionsUIContext.queryParams,
    };
  }, [correctionsUIContext]);

  // corrections Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.corrections.actionsLoading }),
    shallowEqual
  );

  // if corrections weren't selected we should close modal
  useEffect(() => {
    if (!correctionsUIProps.ids || correctionsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteCorrections = () => {
    // server request for deleting correction by selected ids
    dispatch(actions.deleteCorrections(correctionsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchCorrections(correctionsUIProps.queryParams)).then(
        () => {
          // clear selections list
          correctionsUIProps.setIds([]);
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
          Corrections Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected corrections?</span>
        )}
        {isLoading && <span>Corrections are deleting...</span>}
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
            onClick={deleteCorrections}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
