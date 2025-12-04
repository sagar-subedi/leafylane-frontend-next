"use client"
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { USER_LOGIN_SUCCESS } from "@/constants/userConstants";
import { getUserInfoApi } from "@/utils/RestApiCalls";
import { config } from "@/config/env";

const TOKEN_URL = `${config.authServerUrl}/oauth2/token`;
const CLIENT_SECRET = "leafylane-client"; // ⚠️ Don't expose this in frontend! Use a backend proxy instead.

const Callback = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      exchangeCodeForToken(authCode);
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await axios.post(
        TOKEN_URL,
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: config.callbackUrl,
          client_id: config.clientId,
          client_secret: CLIENT_SECRET, // ⚠️ Better to use a backend proxy instead of exposing this
          scope: config.scope
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const { access_token, refresh_token } = response.data;
      const userInfo = {
        token: access_token,
        refresh_token
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      //Get UserInfo
      const userInfoResponse = await getUserInfoApi();
      userInfoResponse.token = access_token;
      userInfoResponse.refresh_token = refresh_token;

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: userInfoResponse
      });

      localStorage.setItem('userInfo', JSON.stringify(userInfoResponse));

      // Save tokens in localStorage (or sessionStorage)
      // localStorage.setItem("accessToken", access_token);
      // localStorage.setItem("refreshToken", refresh_token);

      // Redirect user after login
      window.location.href = "/";
    } catch (error) {
      console.error("Error exchanging code for token", error);
    }
  };

  return <h1>Logging in...</h1>;
};

export default Callback;
