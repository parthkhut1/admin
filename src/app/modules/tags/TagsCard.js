import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { TagsFilter } from "./tags-filter/TagsFilter";
import { TagsTable } from "./tags-table/TagsTable";
import { TagsGrouping } from "./tags-grouping/TagsGrouping";
import { useTagsUIContext } from "./TagsUIContext";

export function TagsCard() {
  const tagsUIContext = useTagsUIContext();
  const tagsUIProps = useMemo(() => {
    return {
      ids: tagsUIContext.ids,
      newTagButtonClick: tagsUIContext.newTagButtonClick,
    };
  }, [tagsUIContext]);

  return (
    <Card>
      <CardHeader title="Tags list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={tagsUIProps.newTagButtonClick}
          >
            New Tag
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <TagsFilter />
        {tagsUIProps.ids.length > 0 && <TagsGrouping />}
        <TagsTable />
      </CardBody>
    </Card>
  );
}
