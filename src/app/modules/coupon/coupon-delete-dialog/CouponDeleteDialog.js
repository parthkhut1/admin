import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";
import * as actions from "../_redux/couponsActions";
import {useCouponsUIContext} from "../CouponsUIContext";

export function CouponDeleteDialog({ id, show, onHide }) {
  // Coupons UI Context
  const couponsUIContext = useCouponsUIContext();
  const couponsUIProps = useMemo(() => {
    return {
      setIds: couponsUIContext.setIds,
      queryParams: couponsUIContext.queryParams
    };
  }, [couponsUIContext]);

  // Coupons Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.coupons.actionsLoading }),
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

  const deleteCoupon = () => {
    // server request for deleting coupon by id
    dispatch(actions.deleteCoupon(id)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchCoupons(couponsUIProps.queryParams));
      // clear selections list
      couponsUIProps.setIds([]);
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
          Coupon Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete this coupon?</span>
        )}
        {isLoading && <span>Coupon is deleting...</span>}
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
            onClick={deleteCoupon}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
