// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/ticketsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../TicketsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useTicketsUIContext } from "../TicketsUIContext";

export function TicketsTable() {
  // tickets UI Context
  const ticketsUIContext = useTicketsUIContext();
  const ticketsUIProps = useMemo(() => {
    return {
      ids: ticketsUIContext.ids,
      setIds: ticketsUIContext.setIds,
      queryParams: ticketsUIContext.queryParams,
      setQueryParams: ticketsUIContext.setQueryParams,
      openEditTicketDialog: ticketsUIContext.openEditTicketDialog,
      openDeleteTicketDialog: ticketsUIContext.openDeleteTicketDialog,
    };
  }, [ticketsUIContext]);

  // Getting curret state of tickets list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.tickets }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;
  // tickets Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    ticketsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchTickets(ticketsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: " ticket Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "user.id",
      text: "User Id",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "user.name",
      text: "User name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "category",
      text: "category",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "priority",
      text: "priority",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "caption",
      text: "caption",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "created_at",
      text: "created at",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "closed_at",
      text: "closed at",
      sort: false,
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
        openEditTicketDialog: ticketsUIProps.openEditTicketDialog,
        openDeleteTicketDialog: ticketsUIProps.openDeleteTicketDialog,
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
    // sizePerPage: ticketsUIProps.queryParams.pageSize,
    // page: ticketsUIProps.queryParams.pageNumber,

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
                  ticketsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: ticketsUIProps.ids,
                  setIds: ticketsUIProps.setIds,
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
