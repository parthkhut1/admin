import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ScopesPage } from "../modules/scope/ScopesPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Scope() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/scope" component={ScopesPage} />

      </Switch>
    </Suspense>
  );
}
