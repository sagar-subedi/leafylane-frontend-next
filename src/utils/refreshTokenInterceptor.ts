import store from "@/store/store";
import axios from "axios";
import { getFromLocalStorage } from "./LocalStorageUtils";
import { logout } from "@/store/slices/userSlice";

export function setupAxiosInterceptors() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        (error?.response?.status === 401 || error?.response?.status === 400) &&
        (originalRequest?.data?.includes("grant_type=refresh_token") || originalRequest?.url?.includes("grant_type=refresh_token"))
      ) {
        localStorage.clear();
        store.dispatch(logout());
        return Promise.reject(error);
      }

      if (error?.response?.status === 401) {
        const refreshToken = JSON.parse(getFromLocalStorage("userInfo"))?.refresh_token;
        if (refreshToken) {
          try {
            const response = await axios.post(
              "https://oauth2-auth-server.sagar88.com.np/oauth2/token",
              new URLSearchParams({
                grant_type: "refresh_token",
                client_id: "leafylane-client",
                client_secret: "leafylane-client",
                refresh_token: refreshToken,
              }),
              {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
              }
            );

            const userInfo = JSON.parse(getFromLocalStorage("userInfo"));
            const updatedUserInfo = {
              ...userInfo,
              token: response.data.access_token,
            };
            localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

            // Update headers
            axios.defaults.headers["Authorization"] = "Bearer " + response.data.access_token;
            originalRequest.headers["Authorization"] = "Bearer " + response.data.access_token;

            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed", refreshError);
            store.dispatch(logout());
            return Promise.reject(refreshError);
          }
        } else {
          store.dispatch(logout());
        }
      }

      return Promise.reject(error);
    }
  );
}
