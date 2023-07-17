import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { QuestionsFilter } from "./questions-filter/QuestionsFilter";
import { QuestionsTable } from "./questions-table/QuestionsTable";
import { QuestionsGrouping } from "./questions-grouping/QuestionsGrouping";
import { useQuestionsUIContext } from "./QuestionsUIContext";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "./_redux/questionsActions";
import BatchInsertQuestionModal from "./question-edit-dialog/batchInsertQuestionModal";

export function QuestionsCard() {
  const questionsUIContext = useQuestionsUIContext();
  const dispatch = useDispatch();
  const handleShow = () => dispatch(actions.setBatchInsertModalStatus(true));
  // questions Redux state
  const { batchModalIsShow } = useSelector(
    (state) => ({
      batchModalIsShow: state.rFillInTheBlanks.batchModalIsShow,
    }),
    shallowEqual
  );
  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
      newQuestionButtonClick: questionsUIContext.newQuestionButtonClick,
    };
  }, [questionsUIContext]);

  return (
    <Card>
      <CardHeader title="Questions list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleShow}
            style={{ marginRight: 10 }}
          >
            Batch Insert Question
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={questionsUIProps.newQuestionButtonClick}
          >
            New Questions
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <QuestionsFilter />
        {questionsUIProps.ids.length > 0 && <QuestionsGrouping />}
        <QuestionsTable />
        <BatchInsertQuestionModal />
      </CardBody>
    </Card>
  );
}
