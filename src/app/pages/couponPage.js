import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CouponsPage } from "../modules/coupon/CouponsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Coupon() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/coupons" component={CouponsPage} />

      </Switch>
    </Suspense>
  );
}
