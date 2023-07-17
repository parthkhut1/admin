import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { PaymentStatusCssClasses } from "../PaymentLogsUIHelpers";
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

export function PaymentsFetchDialog({ show, onHide }) {
  // payments UI Context
  const paymentsUIContext = usePaymentsUIContext();
  const paymentsUIProps = useMemo(() => {
    return {
      ids: paymentsUIContext.ids,
    };
  }, [paymentsUIContext]);

  // payments Redux state
  const { payments } = useSelector(
    (state) => ({
      payments: selectedPayments(
        state.payments.entities,
        paymentsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if payments weren't selected we should close modal
  useEffect(() => {
    if (!paymentsUIProps.ids || paymentsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsUIProps.ids]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Fetch selected elements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="timeline timeline-5 mt-3">
          {payments.map((payment) => (
            <div className="timeline-item align-items-start" key={`id${payment.id}`}>
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
                <span className="ml-3">{payment.lastName}, {payment.firstName}</span>                
              </div>
            </div>
          ))}
        </div>
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
            onClick={onHide}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
