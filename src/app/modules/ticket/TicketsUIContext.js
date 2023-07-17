import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./TicketsUIHelpers";
import { format , parseISO } from "date-fns";


const TicketsUIContext = createContext();

export function useTicketsUIContext() {
  return useContext(TicketsUIContext);
}

export const TicketsUIConsumer = TicketsUIContext.Consumer;

export function TicketsUIProvider({ticketsUIEvents, children}) {
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

  const initTicket = {
    id: undefined,
    user:null,
    category: "",
    priority:"",
    caption: "",
    closed_at:"",
    created_at: "",
    opened: true,
    // created_at: format(new Date(), "yyyy-MM-dd HH:mm"),
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initTicket,
    newTicketButtonClick: ticketsUIEvents.newTicketButtonClick,
    openEditTicketDialog: ticketsUIEvents.openEditTicketDialog,
    openDeleteTicketDialog: ticketsUIEvents.openDeleteTicketDialog,
    openDeleteTicketsDialog: ticketsUIEvents.openDeleteTicketsDialog,
    openFetchTicketsDialog: ticketsUIEvents.openFetchTicketsDialog,
    openUpdateTicketsStatusDialog: ticketsUIEvents.openUpdateTicketsStatusDialog
  };

  return <TicketsUIContext.Provider value={value}>{children}</TicketsUIContext.Provider>;
}