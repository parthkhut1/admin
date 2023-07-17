import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./CategoriesUIHelpers";
import { format , parseISO } from "date-fns";


const CategoriesUIContext = createContext();

export function useCategoriesUIContext() {
  return useContext(CategoriesUIContext);
}

export const CategoriesUIConsumer = CategoriesUIContext.Consumer;

export function CategoriesUIProvider({categoriesUIEvents, children}) {
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

  const initCategory = {
    id: undefined,
    name: "",
    parentIdLevel0: 0,
    parentIdLevel1: 0,
    parentIdLevel2: 0,
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initCategory,
    newCategoryButtonClick: categoriesUIEvents.newCategoryButtonClick,
    openEditCategoryDialog: categoriesUIEvents.openEditCategoryDialog,
    openDeleteCategoryDialog: categoriesUIEvents.openDeleteCategoryDialog,
    openDeleteCategoriesDialog: categoriesUIEvents.openDeleteCategoriesDialog,
    openFetchCategoriesDialog: categoriesUIEvents.openFetchCategoriesDialog,
    openUpdateCategoriesStatusDialog: categoriesUIEvents.openUpdateCategoriesStatusDialog
  };

  return <CategoriesUIContext.Provider value={value}>{children}</CategoriesUIContext.Provider>;
}