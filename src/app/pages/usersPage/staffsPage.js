import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { UsersPage } from "../../modules/users/staffs/UsersPage";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";

export default function UsersList() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/staffs" component={UsersPage} />

      </Switch>
    </Suspense>
  );
}
