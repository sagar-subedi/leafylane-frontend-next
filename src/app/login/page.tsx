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

const LoginScreen = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  console.log("redirect ", redirect)

  const { loading, error, userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, redirect, router]);

  const loginSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ userNameOrEmail, password }));
  };

  const AUTH_URL = "http://167.86.105.91:9080/oauth2/authorize";
  const CLIENT_ID = "relive-client";
  const REDIRECT_URI = "https://leafylane-frontend-next.vercel.app/callback"; // Change to match frontend
  const SCOPE = "message.read";
  const STATE = "dJMLwhM2coXgXTiQ5m4ooL66Bo1z94tqwlcYGTFiiu8=";

  const loginWithOAuth = () => {
    const authUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPE)}&state=${STATE}`;
    window.location.href = authUrl;
  };

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

        <Button type="submit" variant="primary">
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
      <Row className="py-3">
        <Col>
          <Button variant="secondary" onClick={loginWithOAuth}>
            Login with OAuth
          </Button>
        </Col>
      </Row>

      {loading && <FullPageLoader />}
    </FormContainer>
  );
};

export default LoginScreen;
