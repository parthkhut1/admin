import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { ScopesFilter } from "./scopes-filter/ScopesFilter";
import { ScopesTable } from "./scopes-table/ScopesTable";
import { ScopesGrouping } from "./scopes-grouping/ScopesGrouping";
import { useScopesUIContext } from "./ScopesUIContext";

export function ScopesCard() {
  const scopesUIContext = useScopesUIContext();
  const scopesUIProps = useMemo(() => {
    return {
      ids: scopesUIContext.ids,
      newScopeButtonClick: scopesUIContext.newScopeButtonClick,
    };
  }, [scopesUIContext]);

  return (
    <Card>
      <CardHeader title="scope list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={scopesUIProps.newScopeButtonClick}
          >
            New Scope
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ScopesFilter />
        {scopesUIProps.ids.length > 0 && <ScopesGrouping />}
        <ScopesTable />
      </CardBody>
    </Card>
  );
}
