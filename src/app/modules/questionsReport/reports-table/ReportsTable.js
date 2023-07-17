// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/reportsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../ReportsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useReportsUIContext } from "../ReportsUIContext";

export function ReportsTable() {
  // reports UI Context
  const reportsUIContext = useReportsUIContext();
  const reportsUIProps = useMemo(() => {
    return {
      ids: reportsUIContext.ids,
      setIds: reportsUIContext.setIds,
      queryParams: reportsUIContext.queryParams,
      setQueryParams: reportsUIContext.setQueryParams,
      openEditReportDialog: reportsUIContext.openEditReportDialog,
      openDeleteReportDialog: reportsUIContext.openDeleteReportDialog,
    };
  }, [reportsUIContext]);

  // Getting curret state of reports list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.reports }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;

  // reports Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    reportsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchReports(reportsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: " report Id",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left",
      headerClasses: "text-left",
    },
    {
      dataField: "user.name",
      text: "User",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "question_id",
      text: "question_id",
      sort: true,
      formatter: columnFormatters.QuestionsColumnFormater,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "exam_date",
      text: "exam date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "city",
      text: "city",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "country",
      text: "country",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "description",
      text: "description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    // {
    //   dataField: "action",
    //   text: "Actions",
    //   formatter: columnFormatters.ActionsColumnFormatter,
    //   formatExtraData: {
    //     openEditReportDialog: reportsUIProps.openEditReportDialog,
    //     openDeleteReportDialog: reportsUIProps.openDeleteReportDialog,
    //   },
    //   classes: "text-right pr-0",
    //   headerClasses: "text-right pr-3",
    //   style: {
    //     minWidth: "100px",
    //   },
    // },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    // sizePerPage: reportsUIProps.queryParams.pageSize,
    // page: reportsUIProps.queryParams.pageNumber,

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
                  reportsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: reportsUIProps.ids,
                  setIds: reportsUIProps.setIds,
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
