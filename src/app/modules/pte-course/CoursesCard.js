import React, { useMemo , useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { CoursesFilter } from "./courses-filter/CoursesFilter";
import { CoursesTable } from "./courses-table/CoursesTable";
import { CoursesGrouping } from "./courses-grouping/CoursesGrouping";
import { useCoursesUIContext } from "./CoursesUIContext";
import * as actions from "./_redux/coursesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";



export function CoursesCard() {
  const coursesUIContext = useCoursesUIContext();
  const dispatch = useDispatch();
  const coursesUIProps = useMemo(() => {
    return {
      ids: coursesUIContext.ids,
      newCourseButtonClick: coursesUIContext.newCourseButtonClick,
    };
  }, [coursesUIContext]);


  return (
    <Card>
      <CardHeader title="course list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={coursesUIProps.newCourseButtonClick}
          >
            New Course
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <CoursesFilter />
        {coursesUIProps.ids.length > 0 && <CoursesGrouping />}
        <CoursesTable />
      </CardBody>
    </Card>
  );
}
