import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { TagsPage } from "../modules/tags/TagsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Tag() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/tag" component={TagsPage} />

      </Switch>
    </Suspense>
  );
}
