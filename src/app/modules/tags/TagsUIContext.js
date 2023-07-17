import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./TagsUIHelpers";
import { format , parseISO } from "date-fns";


const TagsUIContext = createContext();

export function useTagsUIContext() {
  return useContext(TagsUIContext);
}

export const TagsUIConsumer = TagsUIContext.Consumer;

export function TagsUIProvider({tagsUIEvents, children}) {
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

  const initTag = {
    id: undefined,
    name: "",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initTag,
    newTagButtonClick: tagsUIEvents.newTagButtonClick,
    openEditTagDialog: tagsUIEvents.openEditTagDialog,
    openDeleteTagDialog: tagsUIEvents.openDeleteTagDialog,
    openDeleteTagsDialog: tagsUIEvents.openDeleteTagsDialog,
    openFetchTagsDialog: tagsUIEvents.openFetchTagsDialog,
    openUpdateTagsStatusDialog: tagsUIEvents.openUpdateTagsStatusDialog
  };

  return <TagsUIContext.Provider value={value}>{children}</TagsUIContext.Provider>;
}