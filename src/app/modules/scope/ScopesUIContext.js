import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./ScopesUIHelpers";
import { format , parseISO } from "date-fns";


const ScopesUIContext = createContext();

export function useScopesUIContext() {
  return useContext(ScopesUIContext);
}

export const ScopesUIConsumer = ScopesUIContext.Consumer;

export function ScopesUIProvider({scopesUIEvents, children}) {
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

  const initScope = {
    id: undefined,
    name: "",
    billable_type: "",
    tags:[],
    billables:"",

  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initScope,
    newScopeButtonClick: scopesUIEvents.newScopeButtonClick,
    openEditScopeDialog: scopesUIEvents.openEditScopeDialog,
    openDeleteScopeDialog: scopesUIEvents.openDeleteScopeDialog,
    openDeleteScopesDialog: scopesUIEvents.openDeleteScopesDialog,
    openFetchScopesDialog: scopesUIEvents.openFetchScopesDialog,
    openUpdateScopesStatusDialog: scopesUIEvents.openUpdateScopesStatusDialog
  };

  return <ScopesUIContext.Provider value={value}>{children}</ScopesUIContext.Provider>;
}