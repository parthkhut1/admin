import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CategoriesPage } from "../modules/pte-category/CategoriesPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function category() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/category" component={CategoriesPage} />

      </Switch>
    </Suspense>
  );
}
