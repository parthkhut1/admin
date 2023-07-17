// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/packagesActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../PackagesUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { usePackagesUIContext } from "../PackagesUIContext";

export function PackagesTable() {
  // packages UI Context
  const packagesUIContext = usePackagesUIContext();
  const packagesUIProps = useMemo(() => {
    return {
      ids: packagesUIContext.ids,
      setIds: packagesUIContext.setIds,
      queryParams: packagesUIContext.queryParams,
      setQueryParams: packagesUIContext.setQueryParams,
      openEditPackageDialog: packagesUIContext.openEditPackageDialog,
      openDeletePackageDialog: packagesUIContext.openDeletePackageDialog,
    };
  }, [packagesUIContext]);

  // Getting curret state of packages list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.packages }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;
  // packages Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    packagesUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchPackages(packagesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packagesUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: " Package Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
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
      dataField: "price",
      text: "Price ($)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "duration",
      text: "duration (days)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "tags",
      text: "Tags",
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
        openEditPackageDialog: packagesUIProps.openEditPackageDialog,
        openDeletePackageDialog: packagesUIProps.openDeletePackageDialog,
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
    // sizePerPage: packagesUIProps.queryParams.pageSize,
    // page: packagesUIProps.queryParams.pageNumber,

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
                  packagesUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: packagesUIProps.ids,
                  setIds: packagesUIProps.setIds,
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
