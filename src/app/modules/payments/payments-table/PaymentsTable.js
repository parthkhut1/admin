// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/paymentsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../PaymentLogsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { usePaymentsUIContext } from "../PaymentLogsUIContext";

export function PaymentsTable() {
  // payments UI Context
  const paymentsUIContext = usePaymentsUIContext();
  const paymentsUIProps = useMemo(() => {
    return {
      ids: paymentsUIContext.ids,
      setIds: paymentsUIContext.setIds,
      queryParams: paymentsUIContext.queryParams,
      setQueryParams: paymentsUIContext.setQueryParams,
      openEditPaymentDialog: paymentsUIContext.openEditPaymentDialog,
      openDeletePaymentDialog: paymentsUIContext.openDeletePaymentDialog,
    };
  }, [paymentsUIContext]);

  // Getting curret state of payments list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.payments }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;
  // payments Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    paymentsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchPayments(paymentsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "user.avatar",
      text: "User Image",
      // sort: true,
      formatter: columnFormatters.UserColumnFormatter,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-left",
      headerClasses: "text-left",
    },
    {
      dataField: "user.name",
      text: "Name",
      // sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "price",
      text: "Price",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "discounted_price",
      text: "discounted",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "gateway",
      text: "Gateway",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "created_at",
      text: "payment date",
      // sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    // {
    //   dataField: "gender",
    //   text: "Gender",
    //   sort: false,
    //   sortCaret: sortCaret,
    // },
    // {
    //   dataField: "status",
    //   text: "Status",
      // sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.StatusColumnFormatter,
    //   headerSortingClasses,

    // },
    // {
    //   dataField: "type",
    //   text: "Type",
      // sort: true,
    //   sortCaret: sortCaret,
    //   formatter: columnFormatters.TypeColumnFormatter,
    // },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditPaymentDialog: paymentsUIProps.openEditPaymentDialog,
        openDeletePaymentDialog: paymentsUIProps.openDeletePaymentDialog,
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
    // sizePerPage: paymentsUIProps.queryParams.pageSize,
    // page: paymentsUIProps.queryParams.pageNumber,
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
                  paymentsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: paymentsUIProps.ids,
                  setIds: paymentsUIProps.setIds,
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
