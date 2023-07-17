import axios from "axios";
import SnackbarUtils from "./notistack";

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.data?.payload?.errors) {
      Object.keys(err?.response?.data?.payload?.errors).forEach(
        (key, index) => {
          console.error(
            `[${index}]: `,
            err.response.data.payload.errors[key][0]
          );
          SnackbarUtils.error(err.response.data.payload.errors[key][0]);
        }
      );
    }
    throw err;
  }
);

export default axios;
