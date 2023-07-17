import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./ReportsUIHelpers";
import { format , parseISO } from "date-fns";


const ReportsUIContext = createContext();

export function useReportsUIContext() {
  return useContext(ReportsUIContext);
}

export const ReportsUIConsumer = ReportsUIContext.Consumer;

export function ReportsUIProvider({reportsUIEvents, children}) {
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

  const initReport = {
    id: undefined,
    name: "",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initReport,
    newReportButtonClick: reportsUIEvents.newReportButtonClick,
    openEditReportDialog: reportsUIEvents.openEditReportDialog,
    openDeleteReportDialog: reportsUIEvents.openDeleteReportDialog,
    openDeleteReportsDialog: reportsUIEvents.openDeleteReportsDialog,
    openFetchReportsDialog: reportsUIEvents.openFetchReportsDialog,
    openUpdateReportsStatusDialog: reportsUIEvents.openUpdateReportsStatusDialog
  };

  return <ReportsUIContext.Provider value={value}>{children}</ReportsUIContext.Provider>;
}