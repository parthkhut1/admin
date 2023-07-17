import { useSnackbar } from "notistack";
import React from "react";

const InnerSnackbarUtilsConfigurator = (props) => {
  props.setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => {
  return (
    <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
  );
};

export default {
  success(msg, action, persist) {
    this.toast(msg, "success", action, persist);
  },
  warning(msg, action, persist) {
    this.toast(msg, "warning", action, persist);
  },
  info(msg, action, persist) {
    this.toast(msg, "info", action, persist);
  },
  error(msg, action, persist) {
    this.toast(msg, "error", action, persist);
  },
  toast(msg, variant = "default", action = null, persist = false) {
    const options = { variant, persist };
    if (action) options["action"] = action;
    useSnackbarRef.enqueueSnackbar(msg, { ...options, preventDuplicate: true });
  },
};
