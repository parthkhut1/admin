// please be familiar with react-bootstrap-table-next column formaters
// https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Columns&selectedStory=Column%20Formatter&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
import React from "react";
import { getQuestionLink } from "../../../../utility";

export function QuestionsColumnFormater(cellContent, row) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={getQuestionLink(row.category, row.question_type, row.question_id)}
    >
      {row.question_id}
    </a>
  );
}
