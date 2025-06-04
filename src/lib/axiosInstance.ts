import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { store } from "../app/store";
import { overWriteAccessToken } from "../features/auth/authSlice";

// Solo el accessToken está en memoria

const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// No guardes accessToken aquí:
// let accessToken = store.getState().auth.accessToken;

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = store.getState().auth.accessToken; // 🚀 LÉELO SIEMPRE AQUÍ
    if (config.headers) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:3000/auth/renew",
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;

        // Actualiza el store con el nuevo token
        store.dispatch(overWriteAccessToken(newAccessToken));

        // 🔥 Obtén el nuevo token directamente del store (o usa newAccessToken directamente)
        const updatedAccessToken = store.getState().auth.accessToken;

        if (originalRequest.headers) {
          originalRequest.headers.set(
            "Authorization",
            `Bearer ${updatedAccessToken}`
          );
        }

        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Error al renovar el token:", refreshError);
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;

/* // Ejemplo de uso
instance
  .get("/datos")
  .then((res: AxiosResponse) => console.log(res.data))
  .catch((err: AxiosError) => console.error(err));
 */
