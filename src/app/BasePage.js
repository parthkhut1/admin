import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { ProfilePage } from "./modules/Auth/pages/ProfilePage";

import StaffsList from "./pages/usersPage/staffsPage";
import StudentsList from "./pages/usersPage/studentsPage";
import TrashedList from "./pages/usersPage/trashedPage";

import PaymentLogs from "./pages/paymentsLogsPage";
import Coupon from "./pages/couponPage";
import MockTest from "./pages/mockTestPage";
import Session from "./pages/sesseionPage";
import UpCommingSesseion from "./pages/upCommingSesseionPage";
import Scope from "./pages/scopePage";
import Category from "./pages/categoryPage";
import StudentDashboard from "./pages/studentDashboardPage";
import Course from "./pages/coursePage";
import Package from "./pages/packagesPage";
import Tag from "./pages/tagPage";
import Ticket from "./pages/ticketPage";
import Correction from "./pages/correctionPage";
import Tutorial from "./pages/tutorialPage";
import multipleChoiceMultipleAnswerKnowledgTest from "./pages/knowledgTest/multipleChoiceMultipleAnswer";
import multipleChoiceSingleAnswerKnowledgTest from "./pages/knowledgTest/multipleChoiceSingleAnswer";
import reportsPage from "./pages/reportsPage";

import answerShortQuestion from "./pages/speaking-test-pages/answerShortQuestion";
import describeImage from "./pages/speaking-test-pages/describeImage";
import readAloud from "./pages/speaking-test-pages/readAloud";
import repeatSentence from "./pages/speaking-test-pages/repeatSentence";
import retellLecture from "./pages/speaking-test-pages/retellLecture";
import multipleChoiceMultipleAnswer from "./pages/reading-test-pages/multipleChoiceMultipleAnswer";
import multipleChoiceSingleAnswer from "./pages/reading-test-pages/multipleChoiceSingleAnswer";
import rFillInTheBlanks from "./pages/reading-test-pages/rFillInTheBlanks";
import rwFillInTheBlanks from "./pages/reading-test-pages/rwFillInTheBlanks";
import reorderParagraph from "./pages/reading-test-pages/reorderParagraph";

import summarizeWrittenText from "./pages/writing-test-pages/summarizeWrittenText";
import writeEssay from "./pages/writing-test-pages/writeEssay";

import highlightCorrectSummary from "./pages/listening-test-pages/highlightCorrectSummary";
import highlightIncorrectWords from "./pages/listening-test-pages/highlightIncorrectWords";
import fillInTheBlanks from "./pages/listening-test-pages/fillInTheBlanks";
import lMultipleChoiceMultipleAnswer from "./pages/listening-test-pages/multipleChoiceMultipleAnswer";
import lMultipleChoiceSingleAnswer from "./pages/listening-test-pages/multipleChoiceSingleAnswer";
import selectMissingWord from "./pages/listening-test-pages/selectMissingWord";
import summarizeSpokenText from "./pages/listening-test-pages/summarizeSpokenText";
import writeFromDictation from "./pages/listening-test-pages/writeFromDictation";

import { DashboardPage } from "./pages/DashboardPage";

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  const { user } = useSelector(
    (state) => ({
      user: state.auth.user,
    }),
    shallowEqual
  );

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {/* Redirect from root URL to /dashboard. or /up-comming-session for
        teachers */}
        {user &&
        user?.roles?.length !== 0 &&
        user?.roles?.findIndex((i) => i === "teacher") !== -1 ? (
          <Redirect exact from="/" to="/up-comming-session" />
        ) : (
          <Redirect exact from="/" to="/dashboard" />
        )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/dashboard" component={DashboardPage} />
          )}
        {/* <ContentRoute path="/builder" component={BuilderPage}/> */}
        <ContentRoute path="/user/profile" component={ProfilePage} />
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/staffs" component={StaffsList} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/students" component={StudentsList} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/trashed" component={TrashedList} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/payment-logs" component={PaymentLogs} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/package" component={Package} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/tutorial" component={Tutorial} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/category" component={Category} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/course" component={Course} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/knowledge-tests-mcma"
              component={multipleChoiceMultipleAnswerKnowledgTest}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/knowledge-tests-mcsa"
              component={multipleChoiceSingleAnswerKnowledgTest}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/scope" component={Scope} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/student-dashboard"
              component={StudentDashboard}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/question-reports" component={reportsPage} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/coupons" component={Coupon} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/mock-test" component={MockTest} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin" || "teacher") !==
            -1 && <ContentRoute path="/session" component={Session} />}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin" || "teacher") !==
            -1 && (
            <ContentRoute
              path="/up-comming-session"
              component={UpCommingSesseion}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/tag" component={Tag} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/ticket" component={Ticket} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin" || "teacher") !==
            -1 && <ContentRoute path="/correction" component={Correction} />}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/speaking/answer-short-question"
              component={answerShortQuestion}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/speaking/describe-image"
              component={describeImage}
            />
          )}
        {/* Speaking Routes */}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/speaking/read-aloud" component={readAloud} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/speaking/repeat-sentence"
              component={repeatSentence}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/speaking/retell-lecture"
              component={retellLecture}
            />
          )}
        {/* Writing Routes */}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute path="/writing/write-essay" component={writeEssay} />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/writing/summarize-written-text"
              component={summarizeWrittenText}
            />
          )}
        {/* Reading Routes */}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/reading/rw-fill-in-the-blanks"
              component={rwFillInTheBlanks}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/reading/r-fill-in-the-blanks"
              component={rFillInTheBlanks}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/reading/multiple-choice-multiple-answer"
              component={multipleChoiceMultipleAnswer}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/reading/multiple-choice-single-answer"
              component={multipleChoiceSingleAnswer}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/reading/reorder-paragraph"
              component={reorderParagraph}
            />
          )}
        {/* Listening Routes */}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/highlight-correct-summary"
              component={highlightCorrectSummary}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/highlight-incorrect-words"
              component={highlightIncorrectWords}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/fill-in-the-blanks"
              component={fillInTheBlanks}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/multiple-choice-multiple-answer"
              component={lMultipleChoiceMultipleAnswer}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/multiple-choice-single-answer"
              component={lMultipleChoiceSingleAnswer}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/select-missing-word"
              component={selectMissingWord}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/summarize-spoken-text"
              component={summarizeSpokenText}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "super-admin") !== -1 && (
            <ContentRoute
              path="/listening/write-from-dictation"
              component={writeFromDictation}
            />
          )}
        {user &&
          user?.roles?.length !== 0 &&
          user?.roles?.findIndex((i) => i === "teacher") !== -1 && (
            <Redirect to="/" />
          )}
      </Switch>
    </Suspense>
  );
}
