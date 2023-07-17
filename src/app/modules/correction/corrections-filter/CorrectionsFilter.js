import React, { useMemo } from "react";
import { Formik } from "formik";
import { isEqual } from "lodash";
import { useCorrectionsUIContext } from "../CorrectionsUIContext";

const prepareFilter = (queryParams, values) => {
  const { status, type, question_type, is_uncorrected, searchText } = values;
  const newQueryParams = { ...queryParams };
  const filter = {};

  filter.question_type = question_type !== "" ? question_type : "ReadAloud";
  filter.is_uncorrected = is_uncorrected !== "" ? is_uncorrected : true;

  if (searchText) {
    filter.email = searchText;
  }
  newQueryParams.filter = filter;
  return newQueryParams;
};

export function CorrectionsFilter({ listLoading }) {
  // corrections UI Context
  const correctionsUIContext = useCorrectionsUIContext();
  const correctionsUIProps = useMemo(() => {
    return {
      queryParams: correctionsUIContext.queryParams,
      setQueryParams: correctionsUIContext.setQueryParams,
    };
  }, [correctionsUIContext]);

  // queryParams, setQueryParams,
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(
      correctionsUIProps.queryParams,
      values
    );
    if (!isEqual(newQueryParams, correctionsUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      correctionsUIProps.setQueryParams(newQueryParams);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          status: "", // values => All=""/Susspended=0/Active=1/Pending=2
          type: "", // values => All=""/Business=0/Individual=1
          searchText: "",
          is_uncorrected: "true",
          question_type: "",
        }}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit} className="form form-label-right">
            <div className="form-group row">
              <div className="col-lg-4">
                <select
                  className="form-control"
                  placeholder="Filter by corrected/uncorrected"
                  name="is_uncorrected"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("is_uncorrected", e.target.value);
                    handleSubmit();
                  }}
                  value={values.is_uncorrected}
                >
                  <option value="true">Not Corrected</option>
                  <option value="false">Corrected</option>
                </select>
                <small className="form-text text-muted">
                  <b>Filter</b> by corrected/uncorrected
                </small>
              </div>
              <div className="col-lg-4">
                <select
                  className="form-control"
                  placeholder="Filter by question type"
                  name="question_type"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("question_type", e.target.value);
                    handleSubmit();
                  }}
                  value={values.question_type}
                >
                  <option value="ReadAloud">Read Aloud</option>
                  <option value="RepeatSentence">Repeat Sentence</option>
                  <option value="DescribeImage">Describe Image</option>
                  <option value="RetellLecture">Re-tell Lecture</option>
                  <option value="AnswerShortQuestion">Answer Short Question</option>
                  <option value="SummarizeWrittenText">Summarize Written Text</option>
                  <option value="WriteEssay">Write Essay</option>
                  <option value="SummarizeSpokenText">Summarize Spoken Text</option>
                  <option value="WriteFromDictation">Write From Dictaion</option>
                </select>
                <small className="form-text text-muted">
                  <b>Filter</b> by question type
                </small>
              </div>
              {/* <div className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search"
                  onBlur={handleBlur}
                  value={values.searchText}
                  onChange={(e) => {
                    setFieldValue("searchText", e.target.value);
                    handleSubmit();
                  }}
                />
                <small className="form-text text-muted">
                  <b>Search</b> in all fields
                </small>
              </div> */}
            </div>
          </form>
        )}
      </Formik>
    </>
  );
}
