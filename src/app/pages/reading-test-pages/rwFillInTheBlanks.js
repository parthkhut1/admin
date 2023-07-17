import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { QuestionsPage } from "../../modules/Tests/Reading/RWFillInTheBlanks/QuestionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";

export default function Coupon() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/reading/rw-fill-in-the-blanks" component={QuestionsPage} />

      </Switch>
    </Suspense>
  );
}
