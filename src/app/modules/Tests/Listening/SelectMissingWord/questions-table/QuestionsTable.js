// React bootstrap table next =>
// DOCS: https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/
// STORYBOOK: https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/questionsActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../QuestionsUIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useQuestionsUIContext } from "../QuestionsUIContext";

export function QuestionsTable() {
  // questions UI Context
  const questionsUIContext = useQuestionsUIContext();
  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
      setIds: questionsUIContext.setIds,
      queryParams: questionsUIContext.queryParams,
      setQueryParams: questionsUIContext.setQueryParams,
      openEditQuestionDialog: questionsUIContext.openEditQuestionDialog,
      openDeleteQuestionDialog: questionsUIContext.openDeleteQuestionDialog,
      openAddToMockDialog: questionsUIContext.openAddToMockDialog,
    };
  }, [questionsUIContext]);

  // Getting curret state of questions list from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.selectMissingWords }),
    shallowEqual
  );
  const {
    totalCount,
    currentPage,
    perPage,
    entities,
    listLoading,
  } = currentState;
  // questions Redux state
  const dispatch = useDispatch();
  useEffect(() => {
    // clear selections list
    questionsUIProps.setIds([]);
    // server call by queryParams
    dispatch(actions.fetchQuestions(questionsUIProps.queryParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsUIProps.queryParams, dispatch]);
  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "title",
      text: "title",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "difficulty",
      text: "difficulty",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
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
      dataField: "is_exam_q",
      text: "exam question",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "is_free_for_table",
      text: "Paid/Free",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditQuestionDialog: questionsUIProps.openEditQuestionDialog,
        openDeleteQuestionDialog: questionsUIProps.openDeleteQuestionDialog,
        openAddToMockDialog: questionsUIProps.openAddToMockDialog,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "150px",
      },
    },
  ];
  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    // sizePerPage: questionsUIProps.queryParams.pageSize,
    sizePerPage: perPage,
    // page: questionsUIProps.queryParams.pageNumber,
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
                  questionsUIProps.setQueryParams
                )}
                selectRow={getSelectRow({
                  entities,
                  ids: questionsUIProps.ids,
                  setIds: questionsUIProps.setIds,
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
