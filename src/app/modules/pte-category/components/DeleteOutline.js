import React from "react";

const DeleteOutline = (props) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props?.width ? props?.width : 24}
      height={props?.height ? props?.height : 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        fill={props.color}
        d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"
      />
    </svg>
  );
};

export default DeleteOutline;