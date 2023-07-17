import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/couponsActions";
import { useCouponsUIContext } from "../CouponsUIContext";
import {ModalProgressBar} from "../../../../_metronic/_partials/controls";

export function CouponsDeleteDialog({ show, onHide }) {
  // Coupons UI Context
  const couponsUIContext = useCouponsUIContext();
  const couponsUIProps = useMemo(() => {
    return {
      ids: couponsUIContext.ids,
      setIds: couponsUIContext.setIds,
      queryParams: couponsUIContext.queryParams,
    };
  }, [couponsUIContext]);

  // Coupons Redux state
  const dispatch = useDispatch();
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.coupons.actionsLoading }),
    shallowEqual
  );

  // if coupons weren't selected we should close modal
  useEffect(() => {
    if (!couponsUIProps.ids || couponsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponsUIProps.ids]);

  // looking for loading/dispatch
  useEffect(() => {}, [isLoading, dispatch]);

  const deleteCoupons = () => {
    // server request for deleting coupon by selected ids
    dispatch(actions.deleteCoupons(couponsUIProps.ids)).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchCoupons(couponsUIProps.queryParams)).then(
        () => {
          // clear selections list
          couponsUIProps.setIds([]);
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
          Coupons Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isLoading && (
          <span>Are you sure to permanently delete selected coupons?</span>
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
            onClick={deleteCoupons}
            className="btn btn-primary btn-elevate"
          >
            Delete
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
