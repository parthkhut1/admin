import React from "react";

export function QuestionTextFormatter(cellContent, row) {
  if (row.question_data?.text.length < 100) {
    return <p>{row.question_data?.text}</p>;
  }

  return (
    <div>
      <p>{`${row.question_data?.text.slice(0, 100)} ...`}</p>
    </div>
  );
}
