// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/coursesActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../_metronic/_helpers";
import * as uiHelpers from "../CoursesUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../_metronic/_partials/controls";
import { useCoursesUIContext } from "../CoursesUIContext";

export function CoursesTable() {
  // courses UI Context
  const coursesUIContext = useCoursesUIContext();
  const coursesUIProps = useMemo(() => {
    return {
      ids: coursesUIContext.ids,
      setIds: coursesUIContext.setIds,
      queryParams: coursesUIContext.queryParams,
      setQueryParams: coursesUIContext.setQueryParams,
      openEditCourseDialog: coursesUIContext.openEditCourseDialog,
      openDeleteCourseDialog: coursesUIContext.openDeleteCourseDialog,
    };
  }, [coursesUIContext]);

  // Getting curret state of courses list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.courses }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;
  // courses Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    coursesUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchCourses(coursesUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: " course Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },
    {
      dataField: "title",
      text: "Title",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },

    {
      dataField: "is_free",
      text: "is-free",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      classes: "text-center",
      headerClasses: "text-center",
    },

    {
      dataField: "published_at",
      text: "Published at",
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
        openEditCourseDialog: coursesUIProps.openEditCourseDialog,
        openDeleteCourseDialog: coursesUIProps.openDeleteCourseDialog,
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
    // sizePerPage: coursesUIProps.queryParams.pageSize,
    // page: coursesUIProps.queryParams.pageNumber,
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
                  coursesUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: coursesUIProps.ids,
                  setIds: coursesUIProps.setIds,
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
