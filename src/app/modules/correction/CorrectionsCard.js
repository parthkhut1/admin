import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { CorrectionsFilter } from "./corrections-filter/CorrectionsFilter";
import { CorrectionsTable } from "./corrections-table/CorrectionsTable";
import { CorrectionsGrouping } from "./corrections-grouping/CorrectionsGrouping";
import { useCorrectionsUIContext } from "./CorrectionsUIContext";

export function CorrectionsCard() {
  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      ids: correctionsUIContext.ids,
      newCorrectionButtonClick: correctionsUIContext.newCorrectionButtonClick,
    };
  }, [correctionsUIContext]);

  return (
    <Card>
      <CardHeader title="correction list">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={correctionsUIProps.newCorrectionButtonClick}
          >
            New Correction
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <CorrectionsFilter />
        {correctionsUIProps.ids.length > 0 && <CorrectionsGrouping />}
        <CorrectionsTable />
      </CardBody>
    </Card>
  );
}
