import React from "react";
import { useSubheader } from "../../_metronic/layout";
import { Divider } from "@material-ui/core/Divider";

export const MyPage = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("My Custom title");

  return (
    <>My Page</>
    );
};
