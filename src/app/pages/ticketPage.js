import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { TicketsPage } from "../modules/ticket/TicketsPage";
import { LayoutSplashScreen, ContentRoute } from "../../_metronic/layout";

export default function Ticket() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>

        <ContentRoute path="/ticket" component={TicketsPage} />

      </Switch>
    </Suspense>
  );
}
