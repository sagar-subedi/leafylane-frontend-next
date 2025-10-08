"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import FullPageLoader from "@/components/FullPageLoader";
import { register } from "@/store/slices/userSlice";
import { USER_REGISTER_RESET } from "@/constants/userConstants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const RegisterScreen = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const userRegister = useSelector((state) => state.user.register);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, redirect, router]);

  const registerHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      dispatch({ type: USER_REGISTER_RESET });
    } else {
      dispatch(register({ userName, firstName, email, password }));
    }
  };

  return (
    <Box className="max-w-md mx-auto px-4 py-8 bg-white shadow-md rounded-md">
      {/* Page Title */}
      <Typography variant="h4" className="font-bold text-gray-800 mb-6 text-center">
        Sign Up
      </Typography>

      {/* Error Messages */}
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{JSON.stringify(error)}</Message>}

      {/* Registration Form */}
      <form onSubmit={registerHandler}>
        <Box className="mb-4">
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Box>
        <Box className="mb-4">
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Box>
        <Box className="mb-4">
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box className="mb-4">
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
        <Box className="mb-6">
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>
      </form>

      {/* Login Link */}
      <Box className="mt-4 text-center">
        <Typography variant="body1" className="text-gray-600">
          Have an Account?{" "}
          <Link
            href={redirect ? `/login?redirect=${redirect}` : "/login"}
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </Typography>
      </Box>

      {/* Full Page Loader */}
      {loading && <FullPageLoader />}
    </Box>
  );
};

export default RegisterScreen;