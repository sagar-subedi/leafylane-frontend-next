"use client";
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
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
    dispatch(login({ userNameOrEmail, password }));
  };

  const AUTH_URL = "https://oauth2-auth-server.sagar88.com.np/api/auth/authorize";
  const LOGIN_URL = "https://oauth2-auth-server.sagar88.com.np/api/auth/login"
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
      const response = await fetch("http://67.86.105.91:9080/oauth2/token", {
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
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={loginSubmitHandler}>
        <Form.Group controlId="userNameOrEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username or Email"
            value={userNameOrEmail}
            onChange={(e) => setUserNameOrEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button onClick={()=>{loginWithPkce(userNameOrEmail, password)}} type="submit" variant="primary">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link href={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
      {/* <Row className="py-3">
        <Col>
          <Button variant="secondary" onClick={loginWithOAuth}>
            Login with OAuth
          </Button>
        </Col>
      </Row> */}

      {loading && <FullPageLoader />}
    </FormContainer>
  );
};

export default LoginScreen;
