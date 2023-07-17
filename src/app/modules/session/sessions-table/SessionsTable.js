// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/sessionsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../SessionsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useSessionsUIContext } from "../SessionsUIContext";

export function SessionsTable() {
  // sessions UI Context
  const sessionsUIContext = useSessionsUIContext();
  const sessionsUIProps = useMemo(() => {
    return {
      ids: sessionsUIContext.ids,
      setIds: sessionsUIContext.setIds,
      queryParams: sessionsUIContext.queryParams,
      setQueryParams: sessionsUIContext.setQueryParams,
      openEditSessionDialog: sessionsUIContext.openEditSessionDialog,
      openDeleteSessionDialog: sessionsUIContext.openDeleteSessionDialog
    };
  }, [sessionsUIContext]);

  // Getting curret state of sessions list from store (Redux)
  const { user, currentState } = useSelector(
    (state) => ({ currentState: state.sessions, user: state.auth.user }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading
  } = currentState;

  // sessions Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    sessionsUIProps.setIds([]);
    // server call by queryParams
    dispatch(
      actions.fetchSessions({
        ...sessionsUIProps.queryParams,
        isTeacher:
          user &&
          user?.roles?.length != 0 &&
          user?.roles?.findIndex((i) => i === "teacher") != -1
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: " session Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "teacher.name",
      text: "teacher",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    // {
    //   dataField: "capacity",
    //   text: "no: attendees",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   classes: "text-center",
    //   headerClasses: "text-center",
    // },
    // {
    //   dataField: "is_free",
    //   text: "is-free",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   classes: "text-center",
    //   headerClasses: "text-center",
    // },
    // {
    //   dataField: "tags",
    //   text: "Tags",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   classes: "text-center",
    //   headerClasses: "text-center",
    // },
    {
      dataField: "started_at",
      text: "Start at",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center"
    },
    {
      dataField: "canceled_at",
      text: "canceled-at",
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
        openEditSessionDialog: sessionsUIProps.openEditSessionDialog,
        openDeleteSessionDialog: sessionsUIProps.openDeleteSessionDialog
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
    // sizePerPage: sessionsUIProps.queryParams.pageSize,
    // page: sessionsUIProps.queryParams.pageNumber,
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
                  sessionsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: sessionsUIProps.ids,
                  setIds: sessionsUIProps.setIds,
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
