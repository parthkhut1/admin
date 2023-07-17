import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { MockTestsPage } from "../modules/MockTest/MockTestsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function MockTest() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/mock-test" component={MockTestsPage} />

      </Switch>
    </Suspense>
  );
}
