import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { PackagesPage } from "../modules/package/PackagesPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Packages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/package" component={PackagesPage} />

      </Switch>
    </Suspense>
  );
}
