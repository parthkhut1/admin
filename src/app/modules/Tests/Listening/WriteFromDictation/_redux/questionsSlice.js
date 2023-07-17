import {createSlice} from "@reduxjs/toolkit";

const initialQuestionsState = {
  perPage:10,
  currentPage:1,
  listLoading: false,
  actionsLoading: false,
  totalCount: 0,
  entities: null,
  questionForEdit: undefined,
  lastError: null
};
export const callTypes = {
  list: "list",
  action: "action"
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState: initialQuestionsState,
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
    // getQuestionById
    questionFetched: (state, action) => {
      state.actionsLoading = false;
      state.questionForEdit = action.payload.questionForEdit;
      state.error = null;
    },
    // findQuestions
    questionsFetched: (state, action) => {
      const { totalCount, entities ,perPage , currentPage} = action.payload;
      state.listLoading = false;
      state.error = null;
      state.entities = entities;
      state.totalCount = totalCount;
      state.perPage = perPage;
      state.currentPage = currentPage;
    },
    // createQuestion
    questionCreated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      state.entities.push(action.payload.question);
    },
    // update question
    questionUpdated: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.map(entity => {
        if (entity.id === action.payload.question.id) {
          return action.payload.question;
        }
        return entity;
      });
    },
    // deleteQuestion
    questionDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(el => el.id !== action.payload.id);
    },
    // deleteQuestion
    questionsDeleted: (state, action) => {
      state.error = null;
      state.actionsLoading = false;
      state.entities = state.entities.filter(
        el => !action.payload.ids.includes(el.id)
      );
    },
    // questionsUpdateState
    questionsStatusUpdated: (state, action) => {
      state.actionsLoading = false;
      state.error = null;
      const { ids, status } = action.payload;
      state.entities = state.entities.map(entity => {
        if (ids.findIndex(id => id === entity.id) > -1) {
          entity.status = status;
        }
        return entity;
      });
    }
  }
});
