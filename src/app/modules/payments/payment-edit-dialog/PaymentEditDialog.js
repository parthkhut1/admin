import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/paymentsActions";
import { PaymentEditDialogHeader } from "./PaymentEditDialogHeader";
import { PaymentEditForm } from "./PaymentEditForm";
import { usePaymentsUIContext } from "../PaymentLogsUIContext";
import { useSnackbar } from "notistack";

export function PaymentEditDialog({ id, show, onHide,payment }) {
  // payments UI Context
  const { enqueueSnackbar } = useSnackbar();

  const paymentsUIContext = usePaymentsUIContext();
  const paymentsUIProps = useMemo(() => {
    return {
      initPayment: paymentsUIContext.initPayment,
    };
  }, [paymentsUIContext]);

  // payments Redux state
  const dispatch = useDispatch();
  const { actionsLoading, paymentForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.payments.actionsLoading,
      paymentForEdit: state.payments.paymentForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting payment by id
    dispatch(actions.fetchPayment(payment));
  }, [id, dispatch]);

  // server request for saving payment
  const savePayment = (payment, queryParams) => {
    const dto ={
      ...payment,
      id
    }
    if (!id) {
      // server request for creating payment
      dispatch(actions.createPayment(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchPayments(queryParams)).then(() => {
          // closing delete modal
          enqueueSnackbar("Payment created Successfully!", { variant: "success" });
          onHide();
        })

      });
    } else {
      // server request for updating payment
      dispatch(actions.updatePayment(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchPayments(queryParams)).then(() => {
          // closing delete modal
          enqueueSnackbar("Payment updated Successfully!", { variant: "success" });
          onHide();
        });
      })

    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <PaymentEditDialogHeader id={id} />
      <PaymentEditForm
        savePayment={savePayment}
        actionsLoading={actionsLoading}
        payment={paymentForEdit || paymentsUIProps.initPayment}
        onHide={onHide}
      />
    </Modal>
  );
}
