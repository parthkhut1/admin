import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/reportsActions";
import { useReportsUIContext } from "../ReportsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function ReportsDeleteDialog({ show, onHide }) {
  // reports UI Context
  const reportsUIContext = useReportsUIContext();
  const reportsUIProps = useMemo(() => {
    return {
      ids: reportsUIContext.ids,
      setIds: reportsUIContext.setIds,
      queryParams: reportsUIContext.queryParams,
    };
  }, [reportsUIContext]);

  // reports Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.reports.actionsLoading }),
    shallowEqual
  );

  // if reports weren't selected we should close modal
  useEffect(() => {
    if (!reportsUIProps.ids || reportsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteReports = () => {
    // server request for deleting report by selected ids
    dispatch(actions.deleteReports(reportsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchReports(reportsUIProps.queryParams)).then(
        () => {
          // clear selections list
          reportsUIProps.setIds([]);
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
          Reports Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to delete selected reports?</span>
        )}
        {isLoading && <span>Reports are deleting...</span>}
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
            onClick={deleteReports}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
