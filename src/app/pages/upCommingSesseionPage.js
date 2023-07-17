import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { UpCommingSesseionPage } from "../modules/upCommingSession/SessionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function UpCommingSesseion() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/up-comming-session" component={UpCommingSesseionPage} />

      </Switch>
    </Suspense>
  );
}
