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

export function QuestionsCard() {
  const questionsUIContext = useQuestionsUIContext();
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
      </CardBody>
    </Card>
  );
}
