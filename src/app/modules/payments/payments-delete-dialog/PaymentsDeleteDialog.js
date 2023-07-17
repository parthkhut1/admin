import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/paymentsActions";
import { usePaymentsUIContext } from "../PaymentLogsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function PaymentsDeleteDialog({ show, onHide }) {
  // payments UI Context
  const paymentsUIContext = usePaymentsUIContext();
  const paymentsUIProps = useMemo(() => {
    return {
      ids: paymentsUIContext.ids,
      setIds: paymentsUIContext.setIds,
      queryParams: paymentsUIContext.queryParams,
    };
  }, [paymentsUIContext]);

  // payments Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.payments.actionsLoading }),
    shallowEqual
  );

  // if payments weren't selected we should close modal
  useEffect(() => {
    if (!paymentsUIProps.ids || paymentsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deletePayments = () => {
    // server request for deleting Payment by selected ids
    dispatch(actions.deletePayments(paymentsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchPayments(paymentsUIProps.queryParams)).then(
        () => {
          // clear selections list
          paymentsUIProps.setIds([]);
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
          Payments Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected payments?</span>
        )}
        {isLoading && <span>Payment are deleting...</span>}
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
            onClick={deletePayments}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
