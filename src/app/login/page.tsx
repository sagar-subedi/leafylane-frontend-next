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
import { Box, Button, CircularProgress, TextField, Typography, Paper, Container, Divider } from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { config } from "@/config/env";

const LoginScreen = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  console.log("redirect ", redirect)

  const { loading, error, userInfo } = useSelector((state: any) => state.user);

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

  const loginSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPkce(userNameOrEmail, password);
    // dispatch(login({ userNameOrEmail, password }));
  };

  const AUTH_URL = `${config.authServerUrl}/api/auth/authorize`;
  const LOGIN_URL = `${config.authServerUrl}/api/auth/login`;
  const TOKEN_URL = `${config.authServerUrl}/oauth2/token`;
  const CLIENT_ID = config.clientId;
  const REDIRECT_URI = config.callbackUrl;
  const SCOPE = config.scope;
  const STATE = config.state;

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
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username,
        password,
        clientId: config.clientId,
        codeChallenge: config.codeChallenge,
        codeChallengeMethod: config.codeChallengeMethod,
        redirectUri: config.callbackUrl,
        scope: config.scope,
        state: config.state
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
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: config.callbackUrl,
          client_id: config.clientId,
          code_verifier: config.codeVerifier,
          state: config.state,
          scope: config.scope,
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
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        className="animate-fadeIn"
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Logo and Title */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box className="flex justify-center mb-3">
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-green)',
              }}
            >
              <LocalFloristIcon sx={{ fontSize: 32, color: 'white' }} />
            </Box>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--color-text-muted)',
            }}
          >
            Sign in to your LeafyLane account
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <Box sx={{ mb: 3 }}>
            <Message variant="danger">{error}</Message>
          </Box>
        )}

        {/* Login Form */}
        <form onSubmit={loginSubmitHandler}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Username or Email"
              variant="outlined"
              fullWidth
              required
              value={userNameOrEmail}
              onChange={(e) => setUserNameOrEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--color-primary)',
                },
              }}
            />
          </Box>
          <Box sx={{ mb: 4 }}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary)',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'var(--color-primary)',
                },
              }}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <LockOutlinedIcon />}
            sx={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 'var(--shadow-md)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-dark)',
                transform: 'translateY(-2px)',
                boxShadow: 'var(--shadow-green)',
              },
              '&:disabled': {
                backgroundColor: 'var(--color-border-main)',
              },
              transition: 'all var(--transition-base)',
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        {/* Register Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            New to LeafyLane?{" "}
            <Link
              href={redirect ? `/register?redirect=${redirect}` : "/register"}
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Box>

        {/* OAuth Login (Optional) */}
        {/* <Box sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={loginWithOAuth}
            sx={{
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              '&:hover': {
                borderColor: 'var(--color-primary-dark)',
                backgroundColor: 'rgba(45, 106, 79, 0.04)',
              },
            }}
          >
            Login with OAuth
          </Button>
        </Box> */}
      </Paper>

      {/* Full Page Loader */}
      {loading && <FullPageLoader />}
    </Container>
  );
};

export default LoginScreen;
