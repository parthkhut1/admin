import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { PaymentStatusCssClasses } from "../PaymentLogsUIHelpers";
import * as actions from "../_redux/paymentsActions";
import { usePaymentsUIContext } from "../PaymentLogsUIContext";

const selectedPayments = (entities, ids) => {
  const _payments = [];
  ids.forEach((id) => {
    const payment = entities.find((el) => el.id === id);
    if (payment) {
      _payments.push(payment);
    }
  });
  return _payments;
};

export function PaymentsUpdateStateDialog({ show, onHide }) {
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
  const { payments, isLoading } = useSelector(
    (state) => ({
      payments: selectedPayments(
        state.payments.entities,
        paymentsUIProps.ids
      ),
      isLoading: state.payments.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!paymentsUIProps.ids || paymentsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update payments status by selected ids
    dispatch(actions.updatePaymentsStatus(paymentsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchPayments(paymentsUIProps.queryParams)).then(
          () => {
            // clear selections list
            paymentsUIProps.setIds([]);
            // closing delete modal
            onHide();
          }
        );
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Status has been updated for selected payments
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {/*begin::Loading*/}
        {isLoading && (
          <div className="overlay-layer">
            <div className="spinner spinner-lg spinner-primary" />
          </div>
        )}
        {/*end::Loading*/}

        <div className="timeline timeline-5 mt-3">
          {payments.map((payment) => (
            <div
              className="timeline-item align-items-start"
              key={`paymentsUpdate${payment.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    PaymentStatusCssClasses[payment.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    PaymentStatusCssClasses[payment.status]
                  } label-inline`}
                >
                  ID: {payment.id}
                </span>
                <span className="ml-3">
                  {payment.lastName}, {payment.firstName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="form">
        <div className="form-group">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Suspended</option>
            <option value="1">Active</option>
            <option value="2">Pending</option>
          </select>
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={updateStatus}
            className="btn btn-primary btn-elevate"
          >
            Update Status
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
