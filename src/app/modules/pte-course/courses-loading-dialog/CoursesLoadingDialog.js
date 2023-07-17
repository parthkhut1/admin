import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { LoadingDialog } from "../../../../_metronic/_partials/controls";

export function CoursesLoadingDialog() {
  // courses Redux state
  const { isLoading } = useSelector(
    (state) => ({ isLoading: state.courses.listLoading }),
    shallowEqual
  );
  // looking for loading/dispatch
  useEffect(() => {}, [isLoading]);
  return <LoadingDialog isLoading={isLoading} text="Loading ..." />;
}
