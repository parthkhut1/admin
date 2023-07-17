import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { verifyEmail } from "../_redux/authCrud";
import querystring from "query-string";
import { useSnackbar } from "notistack";

function Verify(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [isRequested, setIsRequested] = useState(false);

  const { history } = props;
  const {
    location: { search },
  } = history;

  const queryParams = querystring.parse(search);

  const emailBase64Decode = (encodedEmail) => {
    const email = encodedEmail.replace(/\-/g, "+").replace(/\_/g, "/");
    if (typeof document != "undefined") {
      // I'm on the web!
      return atob(email);
    } else {
      // I'm in node js
      return Buffer.from(email, "base64").toString();
    }
  };

  useEffect(() => {
    verifyEmail(emailBase64Decode(queryParams.email), queryParams.token)
      .then(() => {
        enqueueSnackbar("Your email verified successfully!", {
          variant: "success",
        });
        history.replace("/auth/login");
      })
      .catch(() => {
        enqueueSnackbar("Some error ocurred.", { variant: "error" });
        history.replace("/auth/login");
      });
  }, []);

  return <></>;
}

export default Verify;
