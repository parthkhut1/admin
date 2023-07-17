import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./QuestionsUIHelpers";

const QuestionsUIContext = createContext();

export function useQuestionsUIContext() {
  return useContext(QuestionsUIContext);
}

export const QuestionsUIConsumer = QuestionsUIContext.Consumer;

export function QuestionsUIProvider({ questionsUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const initQuestion = {
    id: undefined,
    difficulty: "easy",
    examQu: false,
is_for_mock:0,
    mock: "1",
    report_counter: 0,
    is_free_for_table: "",
    is_free: false,
    title: "",
    question_data: {
      text: "",
      options: [],
    },
    question_meta: [],
    question_media: [],
    answer: {
      id: undefined,
      answer: null,
      answer_meta: {
        transcript: "",
      },
      question_id: undefined,
    },
    text_blanks: null,
    tags:"",

  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initQuestion,
    newQuestionButtonClick: questionsUIEvents.newQuestionButtonClick,
    openEditQuestionDialog: questionsUIEvents.openEditQuestionDialog,
    openDeleteQuestionDialog: questionsUIEvents.openDeleteQuestionDialog,
    openDeleteQuestionsDialog: questionsUIEvents.openDeleteQuestionsDialog,
    openFetchQuestionsDialog: questionsUIEvents.openFetchQuestionsDialog,
    openAddToMockDialog: questionsUIEvents.openAddToMockDialog,

    openUpdateQuestionsStatusDialog:
      questionsUIEvents.openUpdateQuestionsStatusDialog,
  };

  return (
    <QuestionsUIContext.Provider value={value}>
      {children}
    </QuestionsUIContext.Provider>
  );
}
