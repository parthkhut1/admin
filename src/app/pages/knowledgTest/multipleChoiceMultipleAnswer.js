import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { QuestionsPage } from "../../modules/knowledgTest/MultipleChoiceMultipleAnswer/QuestionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";

export default function Coupon() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/knowledge-tests-mcma" component={QuestionsPage} />

      </Switch>
    </Suspense>
  );
}
