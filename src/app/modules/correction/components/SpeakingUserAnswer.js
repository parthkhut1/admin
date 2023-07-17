import React from "react";

const SpeakingUserAnswer = ({ correction }) => {
  return (
    <>
      {/* <audio controls controlsList="nodownload"> */}
      {correction.answer && (
        <audio controls>
          <source src={correction.answer} type="audio/ogg" />
          <source src={correction.answer} type="audio/mpeg" />
          <source src={correction.answer} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      {/* <a
                        style={{
                          position: "absolute",
                          top: 36,
                          cursor: "pointer",
                        }}
                        onClick={()=>download("This is the content",`${values.answer.answer}`)}
                      >
                        <GetAppIcon fontSize="large" />
                      </a> */}
    </>
  );
};

export default SpeakingUserAnswer;
