import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { CoursesPage } from "../modules/pte-course/CoursesPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Course() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/course" component={CoursesPage} />

      </Switch>
    </Suspense>
  );
}
