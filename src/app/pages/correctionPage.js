import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CorrectionsPage } from "../modules/correction/CorrectionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Correction() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/correction" component={CorrectionsPage} />

      </Switch>
    </Suspense>
  );
}
