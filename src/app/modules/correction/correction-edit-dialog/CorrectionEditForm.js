// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { format, parseISO } from "date-fns";
import { shallowEqual, useSelector } from "react-redux";

import {
  Input,
  DatePickerField,
  Switch,
} from "../../../../_metronic/_partials/controls";
import { useCorrectionsUIContext } from "../CorrectionsUIContext";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import SpeakingUserAnswer from "../components/SpeakingUserAnswer";
import WritingUserAnswer from "../components/WritingUserAnswer";
import ListeningUserAnswer from "../components/ListeningUserAnswer";

import ReadAloudQuestion from "../components/ReadAloudQuestion";
import ReapetSentenceQuestion from "../components/RepeatSentenceQuestion";
import DescribeImageQuestion from "../components/DescribeImageQuestion";
import RetellLectureQuestion from "../components/RetellLectureQuestion";
import AnswerShortQuestion from "../components/AnswerShortQuestion";
import SummarizeWrittenTextQuestion from "../components/SummarizeWrittenTextQuestion";
import WriteEssayQuestion from "../components/WriteEssayQuestion";
import SummarizeSpokenTextQuestion from "../components/SummarizeSpokenTextQuestion"
import WriteFromDictationQuestion from "../components/WriteFromDictationQuestion";

import ReadAloudCorrection from "../components/ReadAloudCorrection";
import RepeatSentenceCorrection from "../components/RepeatSentenceCorrection";
import DescribeImageCorrection from "../components/DescribeImageCorrection";
import RetellLectureCorrection from "../components/RetellLectureCorrection";
import AnswerShortCorrection from "../components/AnswerShortCorrection";
import WriteFromDictationCorrection from "../components/WriteFromDictationCorrection";
import SummarizeSpokenTextCorrection from '../components/SummarizeSpokenTextCorrection'
import WriteEssayCorrection from "../components/WriteEssayCorrection";
import SummarizeWrittenTextCorrection from "../components/SummarizeWrittenTextCorrection";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: theme.spacing(7),
  },
  sectionTitle: {
    color: "#2971bc",
  },
  question: {
    marginBottom: theme.spacing(7),
  },
  userAnswer: {
    marginBottom: theme.spacing(7),
  },
  correction: {
    marginBottom: theme.spacing(7),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginRight: theme.spacing(1),
  },
}));

// Validation schema
const CorrectionEditSchema = Yup.object().shape({});

export function CorrectionEditForm({
  saveCorrection,
  correction,
  actionsLoading,
  onHide,
}) {
  const correctionsUIContext = useCorrectionsUIContext();
  const [correctionData, setCorrectionData] = useState(null);
  const classes = useStyles();

  const { question } = useSelector(
    (state) => ({
      question: state.corrections.question,
    }),
    shallowEqual
  );

  const correctionsUIProps = useMemo(() => {
    return {
      ids: correctionsUIContext.ids,
      setIds: correctionsUIContext.setIds,
      queryParams: correctionsUIContext.queryParams,
    };
  }, [correctionsUIContext]);

  const handelUserAnswerType = (category) => {
    switch (category) {
      case "Speaking":
        return <SpeakingUserAnswer correction={correction} />;
      case "Writing":
        return <WritingUserAnswer correction={correction} />;
      case "Listening":
        return <ListeningUserAnswer correction={correction} />;
    }
  };

  const renderQuestionType = (questionType) => {
    switch (questionType) {
      case "ReadAloud":
        // code block
        return <ReadAloudQuestion question={question} />;
      case "RepeatSentence":
        // code block
        return <ReapetSentenceQuestion question={question} />;
      case "DescribeImage":
        // code block
        return <DescribeImageQuestion question={question} />;
      case "RetellLecture":
        // code block
        return <RetellLectureQuestion question={question} />;
      case "AnswerShortQuestion":
        // code block
        return <AnswerShortQuestion question={question} />;
      case "SummarizeWrittenText":
        // code block
        return <SummarizeWrittenTextQuestion question={question} />;
      case "WriteEssay":
        // code block
        return <WriteEssayQuestion question={question} />;
      case "WriteFromDictation":
        // code block
        return <WriteFromDictationQuestion question={question} />;
      case "SummarizeSpokenText":
        // code block
        return <SummarizeSpokenTextQuestion question={question} />;
    }
  };

  const handelCorrectionType = (question_type) => {
    switch (question_type) {
      case "ReadAloud":
        return (
          <ReadAloudCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "RepeatSentence":
        return (
          <RepeatSentenceCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "DescribeImage":
        return (
          <DescribeImageCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "RetellLecture":
        return (
          <RetellLectureCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "AnswerShortQuestion":
        return (
          <AnswerShortCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "SummarizeWrittenText":
        return (
          <SummarizeWrittenTextCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "WriteEssay":
        return (
          <WriteEssayCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "SummarizeSpokenText":
        return (
          <SummarizeSpokenTextCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
      case "WriteFromDictation":
        return (
          <WriteFromDictationCorrection
            question={question}
            correctionData={setCorrectionData}
          />
        );
    }
  };

  useEffect(() => {
    console.log("scorrectionData", correctionData);
  }, [correctionData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={correction}
        validationSchema={CorrectionEditSchema}
        onSubmit={(values) => {
          const newValues = {
            ...values,
            answer_id: correction.id,
            result: correctionData,
          };
          saveCorrection(newValues, correctionsUIProps.queryParams);
        }}
      >
        {({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div
                  className="overlay-layer bg-transparent"
                  style={{ zIndex: 10 }}
                >
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className={`col-lg-12`}>
                    <Typography
                      variant="button"
                      className={classes.sectionTitle}
                    >
                      User:{" "}
                    </Typography>
                  </div>
                </div>
                <div className="form-group row">
                  <div className={`col-lg-12 ${classes.header}`}>
                    <Avatar
                      alt="Remy Sharp"
                      src={values.user?.avatar}
                      className={classes.sectionTitle}
                    />
                    <Typography variant="h6">{values.user?.name}</Typography>
                  </div>
                </div>

                <div className="form-group row">
                  <div className={`col-lg-12`}>
                    <Typography
                      variant="button"
                      className={classes.sectionTitle}
                    >
                      Question:{" "}
                    </Typography>
                  </div>
                </div>
                <div className="form-group row">
                  <div className={`col-lg-12 ${classes.question}`}>
                    {renderQuestionType(question?.question_type)}
                  </div>
                </div>

                <div className="form-group row">
                  <div className={`col-lg-12`}>
                    <Typography
                      variant="button"
                      className={classes.sectionTitle}
                    >
                      User Answer:{" "}
                    </Typography>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-12">
                    {handelUserAnswerType(question?.category)}
                  </div>
                </div>

                <div className="form-group row">
                  <div className={`col-lg-12`}>
                    <Typography
                      variant="button"
                      className={classes.sectionTitle}
                    >
                      Correction:
                    </Typography>
                  </div>
                </div>
                <div className="form-group row">
                  <div className={`col-lg-12 ${classes.correction}`}>
                    {handelCorrectionType(question?.question_type)}
                  </div>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
                disabled={actionsLoading}
              >
                Close
              </button>
              <> </>
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={actionsLoading}
              >
                Save
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
