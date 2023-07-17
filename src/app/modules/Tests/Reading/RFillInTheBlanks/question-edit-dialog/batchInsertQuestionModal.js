import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../_redux/questionsActions";
import { useSnackbar } from "notistack";

const BatchInsertQuestionModal = () => {
  const dispatch = useDispatch();
  const inputFileRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  const [file, setFile] = useState(null);

  const handleClose = () => dispatch(actions.setBatchInsertModalStatus(false));
  const handleUpload = () => {
    if (!file)
      return enqueueSnackbar("Please upload a file", { variant: "error" });
    dispatch(actions.batchInserQuestion(file));
  };
  const { actionsLoading, batchModalIsShow } = useSelector(
    (state) => ({
      actionsLoading: state.rFillInTheBlanks.actionsLoading,
      batchModalIsShow: state.rFillInTheBlanks.batchModalIsShow,
    }),
    shallowEqual
  );

  const handleChangeStatus = async (e) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", e.target.files[0]);
    bodyFormData.append("type", "ReadingFillInTheBlanks");

    setFile(bodyFormData);
  };

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal show={batchModalIsShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Batch Insert Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row" style={{ marginTop: 40 }}>
            <div className="col-lg-12">
              You can create multiple question by upload a file like template in
              below.
              <a href="https://sp.cventix.com/storage/280/ReadingFillInTheBlanksTemplate.xlsx">
                Template
              </a>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-lg-12">
              <div style={{ paddingBottom: "5px" }}>
                Upload Your File <span style={{ color: "red" }}>*</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <input
                  type="file"
                  id="files-upload"
                  name="file"
                  onChange={handleChangeStatus}
                  accept=".xls, .xlsx"
                  ref={inputFileRef}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BatchInsertQuestionModal;
