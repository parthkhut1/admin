import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CategoriesPage } from "../modules/StudentDashboard/CategoriesPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function studentDashboard() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/student-dashboard" component={CategoriesPage} />

      </Switch>
    </Suspense>
  );
}
