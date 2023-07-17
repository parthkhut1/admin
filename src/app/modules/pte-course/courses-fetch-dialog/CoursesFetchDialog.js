import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { CourseStatusCssClasses } from "../CoursesUIHelpers";
import { useCoursesUIContext } from "../CoursesUIContext";

const selectedCourses = (entities, ids) => {
  const _courses = [];
  ids.forEach((id) => {
    const course = entities.find((el) => el.id === id);
    if (course) {
      _courses.push(course);
    }
  });
  return _courses;
};

export function CoursesFetchDialog({ show, onHide }) {
  // courses UI Context
  const coursesUIContext = useCoursesUIContext();
  const coursesUIProps = useMemo(() => {
    return {
      ids: coursesUIContext.ids,
    };
  }, [coursesUIContext]);

  // courses Redux state
  const { courses } = useSelector(
    (state) => ({
      courses: selectedCourses(
        state.courses.entities,
        coursesUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if courses weren't selected we should close modal
  useEffect(() => {
    if (!coursesUIProps.ids || coursesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesUIProps.ids]);

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Fetch selected elements
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="timeline timeline-5 mt-3">
          {courses.map((course) => (
            <div className="timeline-item align-items-start" key={`id${course.id}`}>
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    CourseStatusCssClasses[course.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                    className={`label label-lg label-light-${
                      CourseStatusCssClasses[course.status]
                    } label-inline`}
                  >
                    ID: {course.id}
                </span>
                <span className="ml-3">{course.lastName}, {course.firstName}</span>                
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
          <> </>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-primary btn-elevate"
          >
            Ok
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
