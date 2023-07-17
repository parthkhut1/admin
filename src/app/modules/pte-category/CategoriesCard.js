import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { CategoriesFilter } from "./categories-filter/CategoriesFilter";
import { CategoriesTable } from "./categories-table/CategoriesTable";
import { CategoriesGrouping } from "./categories-grouping/CategoriesGrouping";
import { useCategoriesUIContext } from "./CategoriesUIContext";

export function CategoriesCard() {
  const categoriesUIContext = useCategoriesUIContext();
  const categoriesUIProps = useMemo(() => {
    return {
      ids: categoriesUIContext.ids,
      newCategoryButtonClick: categoriesUIContext.newCategoryButtonClick,
    };
  }, [categoriesUIContext]);

  return (
    <Card>
      <CardHeader title="PTE COURSE">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={categoriesUIProps.newCategoryButtonClick}
          >
            New Category
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <CategoriesFilter />
        {categoriesUIProps.ids.length > 0 && <CategoriesGrouping />}
        <CategoriesTable />
      </CardBody>
    </Card>
  );
}
