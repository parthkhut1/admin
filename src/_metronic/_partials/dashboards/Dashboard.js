import React, { useMemo, useEffect, useState } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../layout";
import { Demo1Dashboard } from "./Demo1Dashboard";
import { Demo2Dashboard } from "./Demo2Dashboard";
import { Demo3Dashboard } from "./Demo3Dashboard";
import { Demo4Dashboard } from "./Demo4Dashboard";
import { Demo5Dashboard } from "./Demo5Dashboard";
import { Demo6Dashboard } from "./Demo6Dashboard";
import { Demo7Dashboard } from "./Demo7Dashboard";

import { messaging } from "../../../init-fcm";
import * as requestFromServer from "./statisticsService";

import { shallowEqual, useDispatch, useSelector } from "react-redux";

export function Dashboard() {
  const { user } = useSelector(
    (state) => ({
      user: state.auth.user
    }),
    shallowEqual
  );

  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      demo: objectPath.get(uiService.config, "demo")
    };
  }, [uiService]);

  const firebaseNotification = async () => {
    if (messaging) {
      const notificationPermission = await Notification.requestPermission();

      if (notificationPermission === "denied") return;

      const token = await messaging.getToken();

      requestFromServer
        .setDeviceToken(token)
        .then((response) => {})
        .catch((error) => {
          throw error;
        });
    }

    // navigator.serviceWorker.addEventListener("message", (message) =>
    //   console.log(message)
    // );
  };

  // useEffect(() => {
  //   console.log("deviceToken$$$$$$$$",deviceToken)
  // }, [deviceToken]);

  useEffect(() => {
    firebaseNotification();
  }, []);

  return (
    <>
      {user &&
        user?.roles?.length != 0 &&
        user?.roles?.findIndex((i) => i === "super-admin") != -1 &&
        layoutProps.demo === "demo1" && <Demo1Dashboard />}
      {/* {layoutProps.demo === 'demo1' && <Demo1Dashboard />}
        {layoutProps.demo === 'demo2' && <Demo2Dashboard />}
        {layoutProps.demo === 'demo3' && <Demo3Dashboard />}
        {layoutProps.demo === 'demo4' && <Demo4Dashboard />}
        {layoutProps.demo === 'demo5' && <Demo5Dashboard />}
        {layoutProps.demo === 'demo6' && <Demo6Dashboard />}
        {layoutProps.demo === 'demo7' && <Demo7Dashboard />} */}
    </>
  );
}
