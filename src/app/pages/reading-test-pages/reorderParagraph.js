import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { QuestionsPage } from "../../modules/Tests/Reading/ReorderParagraph/QuestionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";

export default function Coupon() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/reading/reorder-paragraph" component={QuestionsPage} />

      </Switch>
    </Suspense>
  );
}
