import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/mockTestsActions";
import { Spinner } from "react-bootstrap";

import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";

const initialColumns = {
  questions: {
    id: "questions",
    list: [],
  },
  //   doing: {
  //     id: "doing",
  //     list: [],
  //   },
  //   done: {
  //     id: 'done',
  //     list: [],
  //   },
};
const SortQuestionsTab = ({ mockTestId }) => {
  const [columns, setColumns] = useState(initialColumns);
  // mockTests Redux state
  const dispatch = useDispatch();
  const { questions, actionsLoading } = useSelector(
    (state) => ({
      questions: state.mockTests.questions,
      actionsLoading: state.mockTests.actionsLoading,
    }),
    shallowEqual
  );
  const onDragEnd = ({ source, destination }) => {
    console.log("source", source);
    console.log("destination", destination);
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // If the source and destination columns are the same
    // AND if the index is the same, the item isn't moving
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    console.log("start", start);
    console.log("end", end);

    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item

      const newList = start.list.filter((idx, index) => index !== source.index);
      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      const question = start.list[source.index];
      dispatch(
        actions.sortMockTestQuestions(
          mockTestId,
          question.id,
          destination.index + 1
        )
      );

      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter(
        (idx, index) => index !== source.index
      );

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list;
      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };
      // Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  useEffect(() => {
    dispatch(actions.getMockTestQuestions(mockTestId));
  }, [mockTestId]);

  useEffect(() => {
    if (questions)
      setColumns((prev) => ({
        ...prev,
        questions: {
          id: "questions",
          list: questions?.map((q) => ({
            id: q.id,
            title: q.title,
            question_name: q.question_name,
            category: q.category,
          })),
        },
      }));
  }, [questions]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "grid",
          //   gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateColumns: "1fr",
          margin: "24px auto",
          width: "80%",
          gap: "8px",
        }}
      >
        {Object.values(columns).map((col) => (
          <Column col={col} key={col.id} mockId={mockTestId} />
        ))}
      </div>
    </DragDropContext>
  );
};
export default SortQuestionsTab;

const Column = ({ col: { list, id }, mockId }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            border: "1px solid #e4e6ef",
            borderRadius: 5,
          }}
        >
          <h2 style={{ marginTop: 15 }}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </h2>
          <h6 style={{ marginTop: 5, color: "#8a8da2", fontSize: 12 }}>
            Sort questions by drag and drop.
          </h6>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              padding: 5,
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {list.map((text, index) => (
              <Item key={text.id} text={text} index={index} mockId={mockId} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

const Item = ({ text, index, mockId }) => {
  // mockTests Redux state
  const dispatch = useDispatch();
  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading: state.mockTests.actionsLoading,
    }),
    shallowEqual
  );
  const [deletedItemId, setDeletedItemId] = useState(null);

  const removeQuestion = (questionId) => {
    setDeletedItemId(questionId);
    dispatch(actions.deleteQuestion(mockId, questionId));
  };

  return (
    <Draggable draggableId={`${text.id}-${text.title}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            marginTop: 5,
            marginBottom: 5,
            padding: "15px 6px",
            borderRadius: 3,
            border: snapshot.isDragging
              ? "1px solid lightblue"
              : "1px solid #e4e6ef",
            backgroundColor: snapshot.isDragging ? "lightblue" : "white",
            ...provided.draggableProps.style,
          }}
        >
          <div
            style={{
              color: "#3F4254",
              marginLeft: 15,
              fontWeight: 500,
              textDecoration: "none",
              maxWidth: "80%",
            }}
          >
            {`[${text.category}][${text.question_name}] - ${text.title}`}
          </div>

          <div style={{ marginRight: 15 }}>
            {actionsLoading && deletedItemId === text.id && (
              <span
                className="svg-icon svg-icon-md svg-icon-danger"
                style={{ marginLeft: 10 }}
              >
                <Spinner animation="border" variant="warning" size="sm" />
              </span>
            )}
            <span
              className="svg-icon svg-icon-md svg-icon-danger"
              style={{ marginLeft: 10 }}
              onClick={() => {
                removeQuestion(text.id);
              }}
            >
              <SVG src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")} />
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
};
