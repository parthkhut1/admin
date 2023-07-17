import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./PackagesUIHelpers";
import { format, parseISO } from "date-fns";

const PackagesUIContext = createContext();

export function usePackagesUIContext() {
  return useContext(PackagesUIContext);
}

export const PackagesUIConsumer = PackagesUIContext.Consumer;

export function PackagesUIProvider({ packagesUIEvents, children }) {
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

  const initPackage = {
    id: undefined,
    name: "",
    description: null,
    price: 1,
    duration: 1,
    is_recommended: false,
    is_base: true,
    ai_count: 100,
    //type: false, inital value when in the code we have switch not now that comentetd.
    type: true,
    is_ai_count_refreshable: true,
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initPackage,
    newPackageButtonClick: packagesUIEvents.newPackageButtonClick,
    openEditPackageDialog: packagesUIEvents.openEditPackageDialog,
    openDeletePackageDialog: packagesUIEvents.openDeletePackageDialog,
    openDeletePackagesDialog: packagesUIEvents.openDeletePackagesDialog,
    openFetchPackagesDialog: packagesUIEvents.openFetchPackagesDialog,
    openUpdatePackagesStatusDialog:
      packagesUIEvents.openUpdatePackagesStatusDialog,
  };

  return (
    <PackagesUIContext.Provider value={value}>
      {children}
    </PackagesUIContext.Provider>
  );
}
