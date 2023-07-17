import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/mockTestsActions";
import { MockTestEditDialogHeader } from "./MockTestEditDialogHeader";
import { MockTestEditForm } from "./MockTestEditForm";
import { useMockTestsUIContext } from "../MockTestsUIContext";
import { useSnackbar } from "notistack";

export function MockTestEditDialog({ id, show, onHide }) {
  // mockTests UI Context
  const { enqueueSnackbar } = useSnackbar();

  const mockTestsUIContext = useMockTestsUIContext();
  const mockTestsUIProps = useMemo(() => {
    return {
      initMockTest: mockTestsUIContext.initMockTest,
    };
  }, [mockTestsUIContext]);

  // mockTests Redux state
  const dispatch = useDispatch();
  const { actionsLoading, mockTestForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.mockTests.actionsLoading,
      mockTestForEdit: state.mockTests.mockTestForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    // server call for getting mockTest by id
    dispatch(actions.fetchMockTest(id));
  }, [id, dispatch]);

  // server request for saving mockTest
  const saveMockTest = (mockTest, queryParams) => {
    const mockTestWithId = {
      ...mockTest,
      id: mockTestForEdit?.id ? mockTestForEdit?.id : id,
    };

    if (!id && !mockTestForEdit?.id) {
      if (!mockTestWithId.name)
        return enqueueSnackbar("Please write a mock test title.", {
          variant: "error",
        });

      if (!mockTestWithId.valid_till)
        return enqueueSnackbar("Please select a valid till date.", {
          variant: "error",
        });

      // server request for creating mockTest
      dispatch(actions.createMockTest(mockTestWithId)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchMockTests(queryParams)).then(() => {
          // closing delete modal
          // onHide();
        });
      });
    } else {
      // server request for updating mockTest
      dispatch(actions.updateMockTest(mockTestWithId)).then(() => {
        // refresh list after deletion
        dispatch(actions.fetchMockTests(queryParams)).then(() => {
          // closing delete modal
          onHide();
        });
      });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <MockTestEditDialogHeader id={id} />
      <MockTestEditForm
        saveMockTest={saveMockTest}
        actionsLoading={actionsLoading}
        mockTest={mockTestForEdit || mockTestsUIProps.initMockTest}
        onHide={onHide}
      />
    </Modal>
  );
}
