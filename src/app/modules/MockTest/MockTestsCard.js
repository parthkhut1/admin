import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { MockTestsFilter } from "./mockTests-filter/MockTestsFilter";
import { MockTestsTable } from "./mockTests-table/MockTestsTable";
import { MockTestsGrouping } from "./mockTests-grouping/MockTestsGrouping";
import { useMockTestsUIContext } from "./MockTestsUIContext";

export function MockTestsCard() {
  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      ids: mockTestsUIContext.ids,
      newMockTestButtonClick: mockTestsUIContext.newMockTestButtonClick,
    };
  }, [mockTestsUIContext]);

  return (
    <Card>
      <CardHeader title="MockTests list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={mockTestsUIProps.newMockTestButtonClick}
          >
            New Mock Test
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <MockTestsFilter />
        {mockTestsUIProps.ids.length > 0 && <MockTestsGrouping />}
        <MockTestsTable />
      </CardBody>
    </Card>
  );
}
