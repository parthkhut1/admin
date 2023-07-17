import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { QuestionStatusCssClasses } from "../QuestionsUIHelpers";
import { useQuestionsUIContext } from "../QuestionsUIContext";

const selectedQuestions = (entities, ids) => {
  const _questions = [];
  ids.forEach((id) => {
    const question = entities.find((el) => el.id === id);
    if (question) {
      _questions.push(question);
    }
  });
  return _questions;
};

export function QuestionsFetchDialog({ show, onHide }) {
  // questions UI Context
  const questionsUIContext = useQuestionsUIContext();
  const questionsUIProps = useMemo(() => {
    return {
      ids: questionsUIContext.ids,
    };
  }, [questionsUIContext]);

  // questions Redux state
  const { questions } = useSelector(
    (state) => ({
      questions: selectedQuestions(
        state.answerShortQuestions.entities,
        questionsUIProps.ids
      ),
    }),
    shallowEqual
  );

  // if questions weren't selected we should close modal
  useEffect(() => {
    if (!questionsUIProps.ids || questionsUIProps.ids.length === 0) {
      onHide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsUIProps.ids]);

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
          {questions.map((question) => (
            <div className="timeline-item align-items-start" key={`id${question.id}`}>
              <div className="timeline-label font-weight-bolder text-dark-75 font-size-lg text-right pr-3" />
              <div className="timeline-badge">
                <i
                  className={`fa fa-genderless text-${
                    QuestionStatusCssClasses[question.status]
                  } icon-xxl`}
                />
              </div>
              <div className="timeline-content text-dark-50 mr-5">
                <span
                    className={`label label-lg label-light-${
                      QuestionStatusCssClasses[question.status]
                    } label-inline`}
                  >
                    ID: {question.id}
                </span>
                <span className="ml-3">{question.lastName}, {question.firstName}</span>                
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
