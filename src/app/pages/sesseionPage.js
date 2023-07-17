import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { SessionsPage } from "../modules/session/SessionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Session() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/session" component={SessionsPage} />

      </Switch>
    </Suspense>
  );
}
