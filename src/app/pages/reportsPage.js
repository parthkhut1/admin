import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { ReportsPage } from "../modules/questionsReport/ReportsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Reports() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/question-reports" component={ReportsPage} />

      </Switch>
    </Suspense>
  );
}
