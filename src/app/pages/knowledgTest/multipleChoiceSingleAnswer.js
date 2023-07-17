import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { QuestionsPage } from "../../modules/knowledgTest/MultipleChoiceSingleAnswer/QuestionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";

export default function Coupon() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/knowledge-tests-mcsa" component={QuestionsPage} />

      </Switch>
    </Suspense>
  );
}
