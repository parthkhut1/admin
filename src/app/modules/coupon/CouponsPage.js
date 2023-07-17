import React from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/couponsActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { CouponsLoadingDialog } from "./coupons-loading-dialog/CouponsLoadingDialog";
import { CouponEditDialog } from "./coupon-edit-dialog/CouponEditDialog";
import { CouponDeleteDialog } from "./coupon-delete-dialog/CouponDeleteDialog";
import { CouponsDeleteDialog } from "./coupons-delete-dialog/CouponsDeleteDialog";
import { CouponsFetchDialog } from "./coupons-fetch-dialog/CouponsFetchDialog";
import { CouponsUpdateStateDialog } from "./coupons-update-status-dialog/CouponsUpdateStateDialog";
import { CouponsUIProvider } from "./CouponsUIContext";
import { CouponsCard } from "./CouponsCard";

export function CouponsPage({ history }) {
  const dispatch = useDispatch();

  const couponsUIEvents = {
    newCouponButtonClick: () => {
      history.push("/coupons/new");
    },
    openEditCouponDialog: (id) => {
      history.push(`/coupons/${id}/edit`);
    },
    openDeleteCouponDialog: (id) => {
      history.push(`/coupons/${id}/delete`);
    },
    openDeleteCouponsDialog: () => {
      history.push(`/coupons/deleteCoupons`);
    },
    openFetchCouponsDialog: () => {
      history.push(`/coupons/fetch`);
    },
    openUpdateCouponsStatusDialog: () => {
      history.push("/coupons/updateStatus");
    },
  };

  return (
    <CouponsUIProvider couponsUIEvents={couponsUIEvents}>
      <CouponsLoadingDialog />
      <Switch>
        <Route path="/coupons/new">
          {({ history, match }) => (
            <CouponEditDialog
              show={match != null}
              onHide={() => {
                dispatch(actions.resetCoupon());
                dispatch(actions.resetScope());
                history.push("/coupons");
              }}
            />
          )}
        </Route>
        <Route path="/coupons/:id/edit">
          {({ history, match }) => (
            <CouponEditDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                dispatch(actions.resetCoupon());
                dispatch(actions.resetScope());
                history.push("/coupons");
              }}
            />
          )}
        </Route>
        <Route path="/coupons/deleteCoupons">
          {({ history, match }) => (
            <CouponsDeleteDialog
              show={match != null}
              onHide={() => {
                history.push("/coupons");
              }}
            />
          )}
        </Route>
        <Route path="/coupons/:id/delete">
          {({ history, match }) => (
            <CouponDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/coupons");
              }}
            />
          )}
        </Route>
        <Route path="/coupons/fetch">
          {({ history, match }) => (
            <CouponsFetchDialog
              show={match != null}
              onHide={() => {
                history.push("/coupons");
              }}
            />
          )}
        </Route>
        <Route path="/coupons/updateStatus">
          {({ history, match }) => (
            <CouponsUpdateStateDialog
              show={match != null}
              onHide={() => {
                history.push("/coupons");
              }}
            />
          )}
        </Route>
      </Switch>

      <CouponsCard />
    </CouponsUIProvider>
  );
}
