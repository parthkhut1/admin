export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    (config) => {
      // Add baseURL to urls
      config.url = process.env.REACT_APP_BASE_URL + config.url;

      const {
        auth: { authToken },
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );
}
