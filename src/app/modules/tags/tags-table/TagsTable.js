// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/tagsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../TagsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useTagsUIContext } from "../TagsUIContext";

export function TagsTable() {
  // tags UI Context
  const tagsUIContext = useTagsUIContext();
  const tagsUIProps = useMemo(() => {
    return {
      ids: tagsUIContext.ids,
      setIds: tagsUIContext.setIds,
      queryParams: tagsUIContext.queryParams,
      setQueryParams: tagsUIContext.setQueryParams,
      openEditTagDialog: tagsUIContext.openEditTagDialog,
      openDeleteTagDialog: tagsUIContext.openDeleteTagDialog,
    };
  }, [tagsUIContext]);

  // Getting curret state of tags list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.tags }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;

  // tags Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    tagsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchTags(tagsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: " tag Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left",
      headerClasses: "text-left",
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditTagDialog: tagsUIProps.openEditTagDialog,
        openDeleteTagDialog: tagsUIProps.openDeleteTagDialog,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    // sizePerPage: tagsUIProps.queryParams.pageSize,
    // page: tagsUIProps.queryParams.pageNumber,

    sizePerPage: perPage,
    page: currentPage,
  };
  return (
    <>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden"
                bootstrap4
                remote
                keyField="id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  tagsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: tagsUIProps.ids,
                  setIds: tagsUIProps.setIds,
                  hideSelectColumn: true,
                })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
