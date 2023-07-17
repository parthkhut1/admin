import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { CouponStatusCssClasses } from "../CouponsUIHelpers";
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

export function CouponsFetchDialog({ show, onHide }) {
  // Coupons UI Context
  const couponsUIContext = useCouponsUIContext();
  const couponsUIProps = useMemo(() => {
    return {
      ids: couponsUIContext.ids,
    };
  }, [couponsUIContext]);

  // Coupons Redux state
  const { coupons } = useSelector(
    (state) => ({
      coupons: selectedCoupons(
        state.coupons.entities,
        couponsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if coupons weren't selected we should close modal
  useEffect(() => {
    if (!couponsUIProps.ids || couponsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponsUIProps.ids]);

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
          {coupons.map((coupon) => (
            <div className="timeline-item align-items-start" key={`id${coupon.id}`}>
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
                <span className="ml-3">{coupon.lastName}, {coupon.firstName}</span>                
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
