// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/couponsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../CouponsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useCouponsUIContext } from "../CouponsUIContext";

export function CouponsTable() {
  // Coupons UI Context
  const couponsUIContext = useCouponsUIContext();
  const couponsUIProps = useMemo(() => {
    return {
      ids: couponsUIContext.ids,
      setIds: couponsUIContext.setIds,
      queryParams: couponsUIContext.queryParams,
      setQueryParams: couponsUIContext.setQueryParams,
      openEditCouponDialog: couponsUIContext.openEditCouponDialog,
      openDeleteCouponDialog: couponsUIContext.openDeleteCouponDialog,
    };
  }, [couponsUIContext]);

  // Getting curret state of coupons list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.coupons }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;

  // Coupons Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    couponsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchCoupons(couponsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "Coupon Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
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
      dataField: "token",
      text: "Token",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "algorithm_type",
      text: "Type",
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
        openEditCouponDialog: couponsUIProps.openEditCouponDialog,
        openDeleteCouponDialog: couponsUIProps.openDeleteCouponDialog,
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
    // sizePerPage: couponsUIProps.queryParams.pageSize,
    // page: couponsUIProps.queryParams.pageNumber,
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
                  couponsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: couponsUIProps.ids,
                  setIds: couponsUIProps.setIds,
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
