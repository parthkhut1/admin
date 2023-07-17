import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/couponsActions";
import { CouponEditDialogHeader } from "./CouponEditDialogHeader";
import { CouponEditForm } from "./CouponEditForm";
import { useCouponsUIContext } from "../CouponsUIContext";
import { useSnackbar } from "notistack";

export function CouponEditDialog({ id, show, onHide }) {
  // Coupons UI Context
  const { enqueueSnackbar } = useSnackbar();

  const couponsUIContext = useCouponsUIContext();
  const couponsUIProps = useMemo(() => {
    return {
      initCoupon: couponsUIContext.initCoupon,
    };
  }, [couponsUIContext]);

  // Coupons Redux state
  const dispatch = useDispatch();
  const { actionsLoading, couponForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.coupons.actionsLoading,
      couponForEdit: state.coupons.couponForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting Coupon by id
    dispatch(actions.fetchCoupon(id));
  }, [id, dispatch]);

  // server request for saving coupon

  const saveCoupon = (coupon, queryParams) => {
    const dto = {
      ...coupon,
      id,
    };
    console.log("dto",dto);
    if (!coupon.name)
      return enqueueSnackbar("Please write a name.", { variant: "error" });
    if (!coupon.token)
      return enqueueSnackbar("Please write a token.", { variant: "error" });
    // if (coupon.algorithm_type == "percentage" && !coupon.percentage)
    //   return enqueueSnackbar("Please enter percentage.", { variant: "error" });
    // if (coupon.algorithm_type == "fixed" && !coupon.amount)
    //   return enqueueSnackbar("Please enter amount.", { variant: "error" });
    // if (!coupon.minimum_price)
    //   return enqueueSnackbar("Please enter minimum price.", {
    //     variant: "error",
    //   });

    if (!id) {
      if (!coupon.is_all && !coupon.billable_type)
      return enqueueSnackbar("Please select a billable type.", { variant: "error" });
      // server request for creating session
      dispatch(actions.createScope(dto,queryParams)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCoupons(queryParams)).then(() => {
          // closing delete modal

          onHide();
        });
      });
    } else {
      // server request for updating session
      dispatch(actions.updateCoupon(dto)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchCoupons(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <CouponEditDialogHeader id={id} />
      <CouponEditForm
        saveCoupon={saveCoupon}
        actionsLoading={actionsLoading}
        coupon={couponForEdit || couponsUIProps.initCoupon}
        onHide={onHide}
      />
    </Modal>
  );
}
