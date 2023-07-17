import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./MockTestsUIHelpers";
import { format } from "date-fns";

const MockTestsUIContext = createContext();

export function useMockTestsUIContext() {
  return useContext(MockTestsUIContext);
}

export const MockTestsUIConsumer = MockTestsUIContext.Consumer;

export function MockTestsUIProvider({ mockTestsUIEvents, children }) {
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

  const initMockTest = {
    id: undefined,
    name: "",
    durations: {
      speaking:1,
      writing:1,
      reading:1,
      listening:1,
    },
    question_title:"",
    question_type:"",
    difficulty:"",
    isCreationModeRandom:false,
    valid_till:format(new Date(), "yyyy-MM-dd"),
    creationDate_from: "",
    creationDate_to: "",
    published_at: null,
    counters:{
      Reading:0,
      Writing:0,
      Speaking:0,
      Listening:0
    },
    tags:"",

  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initMockTest,
    newMockTestButtonClick: mockTestsUIEvents.newMockTestButtonClick,
    openEditMockTestDialog: mockTestsUIEvents.openEditMockTestDialog,
    openDeleteMockTestDialog: mockTestsUIEvents.openDeleteMockTestDialog,
    openDeleteMockTestsDialog: mockTestsUIEvents.openDeleteMockTestsDialog,
    openFetchMockTestsDialog: mockTestsUIEvents.openFetchMockTestsDialog,
    openUpdateMockTestsStatusDialog:
      mockTestsUIEvents.openUpdateMockTestsStatusDialog,
  };

  return (
    <MockTestsUIContext.Provider value={value}>
      {children}
    </MockTestsUIContext.Provider>
  );
}
