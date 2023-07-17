import { createSlice } from "@reduxjs/toolkit";

const initialCorrectionsState = {
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  perPage:10,
  currentPage:1,
  entities: null,
  correctionForEdit: undefined,
  lastError: null,
  question: null,
  userAnswer: null,
};
export const callTypes = {
  list: "list",
  action: "action",
};

export const correctionsSlice = createSlice({
  name: "corrections",
  initialState: initialCorrectionsState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    // getcorrectionById
    correctionFetched: (state, action) => {
      state.actionsLoading = false;
      state.correctionForEdit = action.payload.correctionForEdit;
      state.error = null;
    },
    // getquestionById
    questionFetched: (state, action) => {
      state.actionsLoading = false;
      state.question = action.payload.question;
      state.error = null;
    },
    // getquestionById
    userAnswerFetched: (state, action) => {
      state.actionsLoading = false;
      state.userAnswer = action.payload.userAnswer;
      state.error = null;
    },
    // findcorrections
    correctionsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // createcorrection
    correctionCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.correction);
    },
    // updatecorrection
    correctionUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map((entity) => {
        if (entity.id === action.payload.correction.id) {
          return action.payload.correction;
        }
        return entity;
      });
    },
    // deletecorrection
    correctionDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    // deletecorrections
    correctionsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        (el) => !action.payload.ids.includes(el.id)
      );
    },
    // correctionsUpdateState
    correctionsStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map((entity) => {
        if (ids.findIndex((id) => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    },
  },
});
