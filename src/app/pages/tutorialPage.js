import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { TutorialsPage } from "../modules/Tutorial/TutorialsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Tutorial() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/tutorial" component={TutorialsPage} />

      </Switch>
    </Suspense>
  );
}
