import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
// import { SessionsFilter } from "./sessions-filter/SessionsFilter";
// import { SessionsTable } from "./sessions-table/SessionsTable";
// import { SessionsGrouping } from "./sessions-grouping/SessionsGrouping";
import { useSessionsUIContext } from "./SessionsUIContext";
import UpCommingSessionListTab from "./components/UpCommingSessionListTab";

export function SessionsCard() {
  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
      ids: sessionsUIContext.ids,
      newSessionButtonClick: sessionsUIContext.newSessionButtonClick,
    };
  }, [sessionsUIContext]);

  return (
    <Card>
      <CardHeader title="Up comming Sessions">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={sessionsUIProps.newSessionButtonClick}
          >
            New session
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {/* <SessionsFilter /> */}
        {/* {sessionsUIProps.ids.length > 0 && <SessionsGrouping />} */}
        {/* <SessionsTable /> */}
        <UpCommingSessionListTab />
      </CardBody>
    </Card>
  );
}
