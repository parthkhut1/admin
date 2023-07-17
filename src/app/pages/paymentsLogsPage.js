import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { PaymentsPage } from "../modules/payments/PaymentLogsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function PaymentLogs() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/payment-logs" component={PaymentsPage} />

      </Switch>
    </Suspense>
  );
}
