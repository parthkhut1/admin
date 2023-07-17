// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/scopesActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../ScopesUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useScopesUIContext } from "../ScopesUIContext";

export function ScopesTable() {
  // scopes UI Context
  const scopesUIContext = useScopesUIContext();
  const scopesUIProps = useMemo(() => {
    return {
      ids: scopesUIContext.ids,
      setIds: scopesUIContext.setIds,
      queryParams: scopesUIContext.queryParams,
      setQueryParams: scopesUIContext.setQueryParams,
      openEditScopeDialog: scopesUIContext.openEditScopeDialog,
      openDeleteScopeDialog: scopesUIContext.openDeleteScopeDialog,
    };
  }, [scopesUIContext]);

  // Getting curret state of scopes list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.scopes }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;
  
  // scopes Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    scopesUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchScopes(scopesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopesUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: " scope Id",
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
      dataField: "billable_type",
      text: "billable type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
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
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditScopeDialog: scopesUIProps.openEditScopeDialog,
        openDeleteScopeDialog: scopesUIProps.openDeleteScopeDialog,
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
    // sizePerPage: scopesUIProps.queryParams.pageSize,
    // page: scopesUIProps.queryParams.pageNumber,
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
                  scopesUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: scopesUIProps.ids,
                  setIds: scopesUIProps.setIds,
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
