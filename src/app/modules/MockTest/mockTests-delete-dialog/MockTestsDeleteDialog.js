import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/mockTestsActions";
import { useMockTestsUIContext } from "../MockTestsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function MockTestsDeleteDialog({ show, onHide }) {
  // mockTests UI Context
  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      ids: mockTestsUIContext.ids,
      setIds: mockTestsUIContext.setIds,
      queryParams: mockTestsUIContext.queryParams,
    };
  }, [mockTestsUIContext]);

  // mockTests Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.mockTests.actionsLoading }),
    shallowEqual
  );

  // if mockTests weren't selected we should close modal
  useEffect(() => {
    if (!mockTestsUIProps.ids || mockTestsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteMockTests = () => {
    // server request for deleting coupon by selected ids
    dispatch(actions.deleteMockTests(mockTestsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchMockTests(mockTestsUIProps.queryParams)).then(
        () => {
          // clear selections list
          mockTestsUIProps.setIds([]);
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
          mockTests Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected mockTests?</span>
        )}
        {isLoading && <span>Coupon are deleting...</span>}
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
            onClick={deleteMockTests}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
