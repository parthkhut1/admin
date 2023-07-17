import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CourseStatusCssClasses } from "../CoursesUIHelpers";
import * as actions from "../_redux/coursesActions";
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

export function CoursesUpdateStateDialog({ show, onHide }) {
  // courses UI Context
  const coursesUIContext = useCoursesUIContext();
  const coursesUIProps = useMemo(() => {
    return {
      ids: coursesUIContext.ids,
      setIds: coursesUIContext.setIds,
      queryParams: coursesUIContext.queryParams,
    };
  }, [coursesUIContext]);

  // courses Redux state
  const { courses, isLoading } = useSelector(
    (state) => ({
      courses: selectedCourses(
        state.courses.entities,
        coursesUIProps.ids
      ),
      isLoading: state.courses.actionsLoading,
    }),
    shallowEqual
  );

  // if !id we should close modal
  useEffect(() => {
    if (!coursesUIProps.ids || coursesUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursesUIProps.ids]);

  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  const updateStatus = () => {
    // server request for update courses status by selected ids
    dispatch(actions.updateCoursesStatus(coursesUIProps.ids, status)).then(
      () => {
        // refresh list after deletion
        dispatch(actions.fetchCourses(coursesUIProps.queryParams)).then(
          () => {
            // clear selections list
            coursesUIProps.setIds([]);
            // closing delete modal
            onHide();
          }
        );
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          Status has been updated for selected courses
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overlay overlay-block cursor-default">
        {/*begin::Loading*/}
        {isLoading && (
          <div className="overlay-layer">
            <div className="spinner spinner-lg spinner-primary" />
          </div>
        )}
        {/*end::Loading*/}

        <div className="timeline timeline-5 mt-3">
          {courses.map((course) => (
            <div
              className="timeline-item align-items-start"
              key={`coursesUpdate${course.id}`}
            >
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
                <span className="ml-3">
                  {course.lastName}, {course.firstName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="form">
        <div className="form-group">
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(+e.target.value)}
          >
            <option value="0">Suspended</option>
            <option value="1">Active</option>
            <option value="2">Pending</option>
          </select>
        </div>
        <div className="form-group">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={updateStatus}
            className="btn btn-primary btn-elevate"
          >
            Update Status
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
