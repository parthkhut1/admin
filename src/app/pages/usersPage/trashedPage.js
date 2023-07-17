import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { UsersPage } from "../../modules/users/trashed/UsersPage";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";

export default function UsersList() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/trashed" component={UsersPage} />

      </Switch>
    </Suspense>
  );
}
