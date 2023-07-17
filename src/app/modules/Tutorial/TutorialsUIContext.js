import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./TutorialsUIHelpers";
import { format , parseISO } from "date-fns";


const TutorialsUIContext = createContext();

export function useTutorialsUIContext() {
  return useContext(TutorialsUIContext);
}

export const TutorialsUIConsumer = TutorialsUIContext.Consumer;

export function TutorialsUIProvider({tutorialsUIEvents, children}) {
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

  const initTutorial = {
    id: undefined,
    name: "", //post category
    title: "", // post
    text: "",
    featuredQuestion: null,
    published_at:format(new Date(), "yyyy-MM-dd HH:mm"),
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initTutorial,
    newTutorialButtonClick: tutorialsUIEvents.newTutorialButtonClick,
    openEditTutorialDialog: tutorialsUIEvents.openEditTutorialDialog,
    openDeleteTutorialDialog: tutorialsUIEvents.openDeleteTutorialDialog,
    openDeleteTutorialsDialog: tutorialsUIEvents.openDeleteTutorialsDialog,
    openFetchTutorialsDialog: tutorialsUIEvents.openFetchTutorialsDialog,
    openUpdateTutorialsStatusDialog: tutorialsUIEvents.openUpdateTutorialsStatusDialog
  };

  return <TutorialsUIContext.Provider value={value}>{children}</TutorialsUIContext.Provider>;
}