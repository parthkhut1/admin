import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./SessionsUIHelpers";
import { format , parseISO } from "date-fns";


const SessionsUIContext = createContext();

export function useSessionsUIContext() {
  return useContext(SessionsUIContext);
}

export const SessionsUIConsumer = SessionsUIContext.Consumer;

export function SessionsUIProvider({sessionsUIEvents, children}) {
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

  const initSession = {
    id: undefined,
    name: "",
    description: "",
    start_url: "",
    teacher: {},
    capacity: 0,
    duration: 0,
    price: 1,
    is_free:false,
    is_private:false,
    registration_from:format(new Date(), "yyyy-MM-dd HH:mm"),
    registration_till:format(new Date(), "yyyy-MM-dd HH:mm"),
    started_at: format(new Date(), "yyyy-MM-dd HH:mm"),
    holder: "zoom_meeting",
    tags:"",
    is_canceled: false,
    is_cancelable: true,
    canceled_at:null,

  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initSession,
    newSessionButtonClick: sessionsUIEvents.newSessionButtonClick,
    openEditSessionDialog: sessionsUIEvents.openEditSessionDialog,
    openDeleteSessionDialog: sessionsUIEvents.openDeleteSessionDialog,
    openDeleteSessionsDialog: sessionsUIEvents.openDeleteSessionsDialog,
    openFetchSessionsDialog: sessionsUIEvents.openFetchSessionsDialog,
    openUpdateSessionsStatusDialog: sessionsUIEvents.openUpdateSessionsStatusDialog
  };

  return <SessionsUIContext.Provider value={value}>{children}</SessionsUIContext.Provider>;
}