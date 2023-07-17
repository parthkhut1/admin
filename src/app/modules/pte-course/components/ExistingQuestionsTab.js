import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as requestFromServer from "../_redux/coursesCrud";
import * as actions from "../_redux/coursesActions";
import SnackbarUtils from "../../../notistack";
import { Button } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";




import EnhancedTable from "./QuestionTable";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function ExistingQuestionsTab({
  selectedSpeakingQuestions = [],
  selectedWritingQuestions = [],
  selectedReadingQuestions = [],
  selectedListeningQuestions = [],
  updatedQuestionsAfterRemove,
  courseId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div className={classes.root}>
    {/* <Button variant="success" style={{margin:"20px 0px"}}>Mock Test Demo</Button>{' '} */}
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Speaking ({selectedSpeakingQuestions.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <EnhancedTable
            onRemove={(questions) => {
              dispatch(actions.removeQuestionsFromCourse(courseId,questions));
            
            }}
            hasRemoveBtn={true}
            isExistTable={true}
            filterdQuestions={selectedSpeakingQuestions}
            
          />
        </AccordionDetails>
      </Accordion>

      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Writing ({selectedWritingQuestions.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <EnhancedTable
            onRemove={(questions) => {
              dispatch(actions.removeQuestionsFromCourse(courseId,questions));
              
            }}
            hasRemoveBtn={true}
            isExistTable={true}
            filterdQuestions={selectedWritingQuestions}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Reading ({selectedReadingQuestions.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <EnhancedTable
            onRemove={(questions) => {
              dispatch(actions.removeQuestionsFromCourse(courseId,questions));
            
            }}
            hasRemoveBtn={true}
            isExistTable={true}
            filterdQuestions={selectedReadingQuestions}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Listening ({selectedListeningQuestions.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <EnhancedTable
            onRemove={(questions) => {
              dispatch(actions.removeQuestionsFromCourse(courseId,questions));
              
            }}
            hasRemoveBtn={true}
            isExistTable={true}
            filterdQuestions={selectedListeningQuestions}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
