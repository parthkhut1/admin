import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./CoursesUIHelpers";
import { format, parseISO } from "date-fns";

const CoursesUIContext = createContext();

export function useCoursesUIContext() {
  return useContext(CoursesUIContext);
}

export const CoursesUIConsumer = CoursesUIContext.Consumer;

export function CoursesUIProvider({ coursesUIEvents, children }) {
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

  const initCourse = {
    id: undefined,
    title: "",
    content: "",
    is_free: true,
    course_category_id: 0,
    published_at: format(new Date(), "yyyy-MM-dd HH:mm"),
//-----------------------------
    parentIdLevel0: 0,
    parentIdLevel1: 0,
    parentIdLevel2: 0,
    parentNameLevel2: "",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    initCourse,
    newCourseButtonClick: coursesUIEvents.newCourseButtonClick,
    openEditCourseDialog: coursesUIEvents.openEditCourseDialog,
    openDeleteCourseDialog: coursesUIEvents.openDeleteCourseDialog,
    openDeleteCoursesDialog: coursesUIEvents.openDeleteCoursesDialog,
    openFetchCoursesDialog: coursesUIEvents.openFetchCoursesDialog,
    openUpdateCoursesStatusDialog:
      coursesUIEvents.openUpdateCoursesStatusDialog,
  };

  return (
    <CoursesUIContext.Provider value={value}>
      {children}
    </CoursesUIContext.Provider>
  );
}
