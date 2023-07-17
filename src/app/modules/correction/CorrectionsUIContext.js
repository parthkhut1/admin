import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./CorrectionsUIHelpers";
import { format , parseISO } from "date-fns";


const CorrectionsUIContext = createContext();

export function useCorrectionsUIContext() {
  return useContext(CorrectionsUIContext);
}

export const CorrectionsUIConsumer = CorrectionsUIContext.Consumer;

export function CorrectionsUIProvider({correctionsUIEvents, children}) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);
  const setQueryParams = useCallback(nextQueryParams => {
    setQueryParamsBase(prevQueryParams => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }

      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }

      return nextQueryParams;
    });
  }, []);

  const initCorrection = {
    id: undefined,
    question: null,
    user:null,
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initCorrection,
    newCorrectionButtonClick: correctionsUIEvents.newCorrectionButtonClick,
    openEditCorrectionDialog: correctionsUIEvents.openEditCorrectionDialog,
    openDeleteCorrectionDialog: correctionsUIEvents.openDeleteCorrectionDialog,
    openDeleteCorrectionsDialog: correctionsUIEvents.openDeleteCorrectionsDialog,
    openFetchCorrectionsDialog: correctionsUIEvents.openFetchCorrectionsDialog,
    openUpdateCorrectionsStatusDialog: correctionsUIEvents.openUpdateCorrectionsStatusDialog
  };

  return <CorrectionsUIContext.Provider value={value}>{children}</CorrectionsUIContext.Provider>;
}