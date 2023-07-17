import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { QuestionsPage } from "../../modules/Tests/Writing/SummarizeWrittenText/QuestionsPage";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";

export default function Coupon() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/writing/summarize-written-text" component={QuestionsPage} />

      </Switch>
    </Suspense>
  );
}
