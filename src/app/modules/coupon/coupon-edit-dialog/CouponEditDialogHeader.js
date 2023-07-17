import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function CouponEditDialogHeader({ id }) {
  // Coupons Redux state
  const { couponForEdit, actionsLoading } = useSelector(
    (state) => ({
      couponForEdit: state.coupons.couponForEdit,
      actionsLoading: state.coupons.actionsLoading,
    }),
    shallowEqual
  );

  const [title, setTitle] = useState("");
  // Title couting
  useEffect(() => {
    let _title = id ? "" : "New Coupon";
    if (couponForEdit && id) {
      _title = `Edit coupon '${couponForEdit.name}'`;
    }

    setTitle(_title);
    // eslint-disable-next-line
  }, [couponForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">{title}</Modal.Title>
      </Modal.Header>
    </>
  );
}
