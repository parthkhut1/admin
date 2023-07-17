// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/mockTestsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../MockTestsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useMockTestsUIContext } from "../MockTestsUIContext";

export function MockTestsTable() {
  // mockTests UI Context
  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      ids: mockTestsUIContext.ids,
      setIds: mockTestsUIContext.setIds,
      queryParams: mockTestsUIContext.queryParams,
      setQueryParams: mockTestsUIContext.setQueryParams,
      openEditMockTestDialog: mockTestsUIContext.openEditMockTestDialog,
      openDeleteMockTestDialog: mockTestsUIContext.openDeleteMockTestDialog
    };
  }, [mockTestsUIContext]);

  // Getting curret state of mockTests list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.mockTests }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading
  } = currentState;

  // mockTests Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    mockTestsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchMockTests(mockTestsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "name",
      text: "Title",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "totalDuration",
      text: "Total Duration (min)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "counters.Speaking",
      text: "Speaking",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "counters.Writing",
      text: "Writing",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "counters.Reading",
      text: "Reading",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "counters.Listening",
      text: "Listening",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "tags",
      text: "Tags",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditMockTestDialog: mockTestsUIProps.openEditMockTestDialog,
        openDeleteMockTestDialog: mockTestsUIProps.openDeleteMockTestDialog
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px"
      }
    }
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,

    // sizePerPage: mockTestsUIProps.queryParams.pageSize,
    // page: mockTestsUIProps.queryParams.pageNumber,

    sizePerPage: perPage,
    page: currentPage
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
                  mockTestsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: mockTestsUIProps.ids,
                  setIds: mockTestsUIProps.setIds,
                  hideSelectColumn: true
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
