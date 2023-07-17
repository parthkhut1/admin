import React from "react";

const Close = (props) => {
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
        d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7,13H17V11H7"
      />
    </svg>
  );
};

export default Close;
