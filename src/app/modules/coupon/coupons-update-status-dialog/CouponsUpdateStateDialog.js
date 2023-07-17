import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CouponStatusCssClasses } from "../CouponsUIHelpers";
import * as actions from "../_redux/couponsActions";
import { useCouponsUIContext } from "../CouponsUIContext";

const selectedCoupons = (entities, ids) => {
  const _coupons = [];
  ids.forEach((id) => {
    const coupon = entities.find((el) => el.id === id);
    if (coupon) {
      _coupons.push(coupon);
    }
  });
  return _coupons;
};

export function CouponsUpdateStateDialog({ show, onHide }) {
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
  const { coupons, isLoading } = useSelector(
    (state) => ({
      coupons: selectedCoupons(
        state.coupons.entities,
        couponsUIProps.ids
      ),
      isLoading: state.coupons.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!couponsUIProps.ids || couponsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponsUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update coupons status by selected ids
    dispatch(actions.updateCouponsStatus(couponsUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchCoupons(couponsUIProps.queryParams)).then(
          () => {
            // clear selections list
            couponsUIProps.setIds([]);
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
          Status has been updated for selected coupons
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
          {coupons.map((coupon) => (
            <div
              className="timeline-item align-items-start"
              key={`couponsUpdate${coupon.id}`}
            >
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    CouponStatusCssClasses[coupon.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                  className={`label label-lg label-light-${
                    CouponStatusCssClasses[coupon.status]
                  } label-inline`}
                >
                  ID: {coupon.id}
                </span>
                <span className="ml-3">
                  {coupon.lastName}, {coupon.firstName}
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
