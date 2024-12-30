import axios, { AxiosResponse } from "axios";

// const baseURL = `https://638d-59-153-247-212.ngrok-free.app`;
const baseURL = `http://localhost:5000`;

const collaborativeFilteringInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "ngrok-skip-browser-warning": "true",
  },
});

const handleSuccessResponse = (response: AxiosResponse<any, any>) => {
  return response;
};

const handleErrorResponse = (error: any) => {
  try {
    return Promise.reject(error.response.data);
  } catch (e) {
    return Promise.reject({ message: "Network Error" });
  }
};

export const setCFHeaderConfigAxios = (token?: string) => {
  if (token) {
    collaborativeFilteringInstance.defaults.headers.common["Authorization"] =
      token ? "Bearer " + token : "";
  } else {
    delete collaborativeFilteringInstance.defaults.headers.common[
      "Authorization"
    ];
  }
};

collaborativeFilteringInstance.interceptors.response.use(
  handleSuccessResponse,
  handleErrorResponse
);

export default collaborativeFilteringInstance;
