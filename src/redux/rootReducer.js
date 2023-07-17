import {all} from "redux-saga/effects";
import {combineReducers} from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import {usersSlice as staffsSlice} from "../app/modules/users/staffs/_redux/usersSlice";
import {usersSlice as studentsSlice} from "../app/modules/users/students/_redux/usersSlice";
import {usersSlice as trashedSlice} from "../app/modules/users/trashed/_redux/usersSlice";
import {paymentsSlice} from "../app/modules/payments/_redux/paymentsSlice";
import {couponsSlice} from "../app/modules/coupon/_redux/couponsSlice";
import {mockTestsSlice} from "../app/modules/MockTest/_redux/mockTestsSlice";
import {sessionsSlice} from "../app/modules/session/_redux/sessionsSlice";
import {scopesSlice} from "../app/modules/scope/_redux/scopesSlice";
import {categoriesSlice} from "../app/modules/pte-category/_redux/categoriesSlice";
import {coursesSlice} from "../app/modules/pte-course/_redux/coursesSlice";
import {packagesSlice} from "../app/modules/package/_redux/packagesSlice";
import {tagsSlice} from "../app/modules/tags/_redux/tagsSlice";
import {ticketsSlice} from "../app/modules/ticket/_redux/ticketsSlice";
import {correctionsSlice} from "../app/modules/correction/_redux/correctionsSlice";
import {notificationsSlice} from "../app/modules/Notification/notificationsSlice";
import {tutorialsSlice} from "../app/modules/Tutorial/_redux/tutorialsSlice";
import {categoriesSlice as StudentDashboard} from "../app/modules/StudentDashboard/_redux/categoriesSlice";
import {reportsSlice} from "../app/modules/questionsReport/_redux/reportsSlice";

//speaking qustion
import {questionsSlice as AnswerShortQuestionSlice} from "../app/modules/Tests/Speaking/AnswerShortQuestion/_redux/questionsSlice";
import {questionsSlice as DescribeImageSlice} from "../app/modules/Tests/Speaking/DescribeImage/_redux/questionsSlice";
import {questionsSlice as ReadAloudSlice} from "../app/modules/Tests/Speaking/ReadAloud/_redux/questionsSlice";
import {questionsSlice as RepeatSentenceSlice} from "../app/modules/Tests/Speaking/RepeatSentence/_redux/questionsSlice";
import {questionsSlice as RetellLectureSlice} from "../app/modules/Tests/Speaking/RetellLecture/_redux/questionsSlice";

//wirting
import {questionsSlice as SummarizeWrittenTextSlice} from "../app/modules/Tests/Writing/SummarizeWrittenText/_redux/questionsSlice";
import {questionsSlice as WriteEssaySlice} from "../app/modules/Tests/Writing/WriteEssay/_redux/questionsSlice";

//reading
import {questionsSlice as RWFillInTheBlanksSlice} from "../app/modules/Tests/Reading/RWFillInTheBlanks/_redux/questionsSlice";
import {questionsSlice as RFillInTheBlanksSlice} from "../app/modules/Tests/Reading/RFillInTheBlanks/_redux/questionsSlice";
import {questionsSlice as MultipleChoiceMultipleAnswerSlice} from "../app/modules/Tests/Reading/MultipleChoiceMultipleAnswer/_redux/questionsSlice";
import {questionsSlice as MultipleChoiceSingleAnswerSlice} from "../app/modules/Tests/Reading/MultipleChoiceSingleAnswer/_redux/questionsSlice";
import {questionsSlice as ReorderParagraphSlice} from "../app/modules/Tests/Reading/ReorderParagraph/_redux/questionsSlice";

//listening
import {questionsSlice as HighlightCorrectSummarySlice} from "../app/modules/Tests/Listening/HighlightCorrectSummary/_redux/questionsSlice";
import {questionsSlice as HighlightIncorrectWordsSlice} from "../app/modules/Tests/Listening/HighlightIncorrectWords/_redux/questionsSlice";
import {questionsSlice as FillInTheBlanksSlice} from "../app/modules/Tests/Listening/FillInTheBlanks/_redux/questionsSlice";
import {questionsSlice as lMultipleChoiceMultipleAnswerSlice} from "../app/modules/Tests/Listening/MultipleChoiceMultipleAnswer/_redux/questionsSlice";
import {questionsSlice as lMultipleChoiceSingleAnswerSlice} from "../app/modules/Tests/Listening/MultipleChoiceSingleAnswer/_redux/questionsSlice";
import {questionsSlice as SelectMissingWordSlice} from "../app/modules/Tests/Listening/SelectMissingWord/_redux/questionsSlice";
import {questionsSlice as SummarizeSpokenTextSlice} from "../app/modules/Tests/Listening/SummarizeSpokenText/_redux/questionsSlice";
import {questionsSlice as WriteFromDictationSlice} from "../app/modules/Tests/Listening/WriteFromDictation/_redux/questionsSlice";



// import {productsSlice} from "../app/modules/ECommerce/_redux/products/productsSlice";
// import {remarksSlice} from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
// import {specificationsSlice} from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  staffs: staffsSlice.reducer,
  students: studentsSlice.reducer,
  trashed: trashedSlice.reducer,
  payments: paymentsSlice.reducer,
  coupons: couponsSlice.reducer,
  mockTests: mockTestsSlice.reducer,
  sessions: sessionsSlice.reducer,
  scopes: scopesSlice.reducer,
  categories: categoriesSlice.reducer,
  courses: coursesSlice.reducer,
  packages: packagesSlice.reducer,
  tags: tagsSlice.reducer,
  notifications: notificationsSlice.reducer,
  tickets: ticketsSlice.reducer,
  corrections: correctionsSlice.reducer,
  tutorials: tutorialsSlice.reducer,
  studentDashboards: StudentDashboard.reducer,
  reports: reportsSlice.reducer,

  // Speaking question reducers
  answerShortQuestions: AnswerShortQuestionSlice.reducer,
  describeImages: DescribeImageSlice.reducer,
  readAlouds: ReadAloudSlice.reducer,
  retellLectures: RetellLectureSlice.reducer,
  repeatSentences: RepeatSentenceSlice.reducer,

  
  // Writing reducers
  summarizeWrittenTexts: SummarizeWrittenTextSlice.reducer,
  writeEssays: WriteEssaySlice.reducer,

  // Reading reducers
  rwFillInTheBlanks: RWFillInTheBlanksSlice.reducer,
  rFillInTheBlanks: RFillInTheBlanksSlice.reducer,
  multipleChoiceMultipleAnswers: MultipleChoiceMultipleAnswerSlice.reducer,
  multipleChoiceSingleAnswers: MultipleChoiceSingleAnswerSlice.reducer,
  reorderParagraphs: ReorderParagraphSlice.reducer,

    // Listening reducers
    highlightCorrectSummaries: HighlightCorrectSummarySlice.reducer,
    highlightIncorrectWords: HighlightIncorrectWordsSlice.reducer,
    fillInTheBlanks: FillInTheBlanksSlice.reducer,
    lMultipleChoiceMultipleAnswers: lMultipleChoiceMultipleAnswerSlice.reducer,
    lMultipleChoiceSingleAnswers: lMultipleChoiceSingleAnswerSlice.reducer,
    selectMissingWords: SelectMissingWordSlice.reducer,
    summarizeSpokenTexts: SummarizeSpokenTextSlice.reducer,
    writeFromDictations: WriteFromDictationSlice.reducer,

});

export function* rootSaga() {
  yield all([auth.saga()]);
}
