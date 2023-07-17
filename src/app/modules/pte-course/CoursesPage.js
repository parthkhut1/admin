import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import * as actions from "./_redux/coursesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { CoursesLoadingDialog } from "./courses-loading-dialog/CoursesLoadingDialog";
import { CourseEditDialog } from "./course-edit-dialog/CourseEditDialog";
import { CourseDeleteDialog } from "./course-delete-dialog/CourseDeleteDialog";
import { CoursesDeleteDialog } from "./courses-delete-dialog/CoursesDeleteDialog";
import { CoursesFetchDialog } from "./courses-fetch-dialog/CoursesFetchDialog";
import { CoursesUpdateStateDialog } from "./courses-update-status-dialog/CoursesUpdateStateDialog";
import { CoursesUIProvider } from "./CoursesUIContext";
import { CoursesCard } from "./CoursesCard";

export function CoursesPage({ history }) {
  const dispatch = useDispatch();

  const coursesUIEvents = {
    newCourseButtonClick: () => {
      history.push("/course/new");
    },
    openEditCourseDialog: (row) => {
      history.push(`/course/${row.id}/edit`);
    },
    openDeleteCourseDialog: (id) => {
      history.push(`/course/${id}/delete`);
    },
    openDeleteCoursesDialog: () => {
      history.push(`/course/deleteCustomers`);
    },
    openFetchCoursesDialog: () => {
      history.push(`/course/fetch`);
    },
    openUpdateCoursesStatusDialog: () => {
      history.push("/course/updateStatus");
    },
  };

  return (
    <CoursesUIProvider coursesUIEvents={coursesUIEvents}>
      <CoursesLoadingDialog />
      <Route path="/course/new">
        {({ history, match }) => (
          <CourseEditDialog
            show={match != null}
            onHide={() => {
              dispatch(actions.resetCourse());
              dispatch(actions.resetLevel1());
              dispatch(actions.resetLevel2());
              dispatch(actions.resetFilteredQuestions());

              history.push("/course");
            }}
          />
        )}
      </Route>
      <Route path="/course/:id/edit">
        {({ history, match }) => (
          <CourseEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              dispatch(actions.resetLevel1());
              dispatch(actions.resetLevel2());
              dispatch(actions.resetFilteredQuestions());
              history.push("/course");
            }}
          />
        )}
      </Route>
      <Route path="/course/deleteCustomers">
        {({ history, match }) => (
          <CoursesDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/course");
            }}
          />
        )}
      </Route>
      <Route path="/course/:id/delete">
        {({ history, match }) => (
          <CourseDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/course");
            }}
          />
        )}
      </Route>
      <Route path="/course/fetch">
        {({ history, match }) => (
          <CoursesFetchDialog
            show={match != null}
            onHide={() => {
              history.push("/course");
            }}
          />
        )}
      </Route>
      <Route path="/course/updateStatus">
        {({ history, match }) => (
          <CoursesUpdateStateDialog
            show={match != null}
            onHide={() => {
              history.push("/course");
            }}
          />
        )}
      </Route>
      <CoursesCard />
    </CoursesUIProvider>
  );
}
