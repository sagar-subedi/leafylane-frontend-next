"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import FormContainer from "@/components/FormContainer";
import FullPageLoader from "@/components/FullPageLoader";
import { login } from "@/store/slices/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import pkceChallenge from "pkce-challenge";
import { getUserInfoApi } from "@/utils/RestApiCalls";
import { USER_LOGIN_SUCCESS } from "@/constants/userConstants";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";

const LoginScreen = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  console.log("redirect ", redirect)

  const { loading, error, userInfo } = useSelector((state) => state.user);

  let codeVerifier: string;
  let codeChallenge: string;

  pkceChallenge().then((pkce) => {
    codeVerifier = pkce.code_verifier;
    codeChallenge = pkce.code_challenge;
  });

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, redirect, router]);

  const loginSubmitHandler = (e) => {
    e.preventDefault();
    loginWithPkce(userNameOrEmail, password);
    // dispatch(login({ userNameOrEmail, password }));
  };

  const AUTH_URL = "http://localhost:9080/api/auth/authorize";
  const LOGIN_URL = "http://localhost:9080/api/auth/login"
  const CLIENT_ID = "leafylane-client";
  const REDIRECT_URI = "https://leafylane.sagar88.com.np/callback"; // Change to match frontend
  const SCOPE = "store.shop offline_access";
  const STATE = "dJMLwhM2coXgXTiQ5m4ooL66Bo1z94tqwlcYGTFiiu8=";

  const loginWithOAuth = () => {
    const authUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPE)}&state=${STATE}`;
    window.location.href = authUrl;
  };

  async function loginWithPkce(username: any, password: any) {
    console.log("trying to login with pkce");
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }      ,
      body: new URLSearchParams({
        username,
        password,
        clientId: "leafylane-client-spa",
        codeChallenge: "Xs5p9CFnsixtb5Fnq5JK9E0Kj5eh0WBhFuvvhAfhrMo",
        codeChallengeMethod: "S256",
        redirectUri: "http://localhost:3000/callback",
        scope: "store.shop offline_access",
        state: "dJMLwhM2coXgXTiQ5m4ooL66Bo1z94tqwlcYGTFiiu8"
      }),
    });
    const data = await response.json();
    if (response.ok) {
      const authorizationCode = data.code;
      exchangeAuthorizationCode(authorizationCode, codeVerifier);
    } else {
      console.error("Login failed:", data);
    }
  }

  async function exchangeAuthorizationCode(authorizationCode: any, codeVerifier: any) {
    try {
      const response = await fetch("http://localhost:9080/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: "http://localhost:3000/callback",
          client_id: "leafylane-client-spa",
          code_verifier: "pUh2fQtq~Cqc~aWskoZK2BWEFezeLZCK1rADtcvVbdh",
          state: "dJMLwhM2coXgXTiQ5m4ooL66Bo1z94tqwlcYGTFiiu8",
          scope: "store.shop offline_access",
        }),
      });
    
      const { access_token, refresh_token } = await response.json(); 
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
  }

  return (
    <Box className="max-w-md mx-auto px-4 py-8 bg-white shadow-md rounded-md">
      {/* Page Title */}
      <Typography variant="h4" className="font-bold text-gray-800 mb-6 text-center">
        Sign In
      </Typography>

      {/* Error Message */}
      {error && <Message variant="danger">{error}</Message>}

      {/* Login Form */}
      <form onSubmit={loginSubmitHandler}>
        <Box className="mb-4">
          <TextField
            label="Username or Email"
            variant="outlined"
            fullWidth
            required
            value={userNameOrEmail}
            onChange={(e) => setUserNameOrEmail(e.target.value)}
          />
        </Box>
        <Box className="mb-6">
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>
      </form>

      {/* Register Link */}
      <Box className="mt-4 text-center">
        <Typography variant="body1" className="text-gray-600">
          New Customer?{" "}
          <Link
            href={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </Typography>
      </Box>

      {/* OAuth Login (Optional) */}
      {/* <Box className="mt-4 text-center">
        <Button
          variant="outlined"
          color="secondary"
          onClick={loginWithOAuth}
          className="w-full"
        >
          Login with OAuth
        </Button>
      </Box> */}

      {/* Full Page Loader */}
      {loading && <FullPageLoader />}
    </Box>
  );
};

export default LoginScreen;
