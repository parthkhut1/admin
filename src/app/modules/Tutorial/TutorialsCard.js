import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { TutorialsFilter } from "./tutorials-filter/TutorialsFilter";
import { TutorialsTable } from "./tutorials-table/TutorialsTable";
import { TutorialsGrouping } from "./tutorials-grouping/TutorialsGrouping";
import { useTutorialsUIContext } from "./TutorialsUIContext";

export function TutorialsCard() {
  const tutorialsUIContext = useTutorialsUIContext();
  const tutorialsUIProps = useMemo(() => {
    return {
      ids: tutorialsUIContext.ids,
      newTutorialButtonClick: tutorialsUIContext.newTutorialButtonClick,
    };
  }, [tutorialsUIContext]);

  return (
    <Card>
      <CardHeader title="Tutorial list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={tutorialsUIProps.newTutorialButtonClick}
          >
            New Tutorial
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <TutorialsFilter />
        {tutorialsUIProps.ids.length > 0 && <TutorialsGrouping />}
        <TutorialsTable />
      </CardBody>
    </Card>
  );
}
