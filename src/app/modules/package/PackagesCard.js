import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { PackagesFilter } from "./packages-filter/PackagesFilter";
import { PackagesTable } from "./packages-table/PackagesTable";
import { PackagesGrouping } from "./packages-grouping/PackagesGrouping";
import { usePackagesUIContext } from "./PackagesUIContext";

export function PackagesCard() {
  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      ids: packagesUIContext.ids,
      newPackageButtonClick: packagesUIContext.newPackageButtonClick,
    };
  }, [packagesUIContext]);

  return (
    <Card>
      <CardHeader title="package list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={packagesUIProps.newPackageButtonClick}
          >
            New Package
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <PackagesFilter />
        {packagesUIProps.ids.length > 0 && <PackagesGrouping />}
        <PackagesTable />
      </CardBody>
    </Card>
  );
}
