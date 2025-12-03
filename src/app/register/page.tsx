"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  Container,
  Divider,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import FullPageLoader from "@/components/FullPageLoader";
import { register } from "@/store/slices/userSlice";
import { USER_REGISTER_RESET } from "@/constants/userConstants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

const RegisterScreen = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const userRegister = useSelector((state: any) => state.user.register);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect);
    }
  }, [userInfo, redirect, router]);

  const registerHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      dispatch({ type: USER_REGISTER_RESET });
    } else {
      dispatch(register({ userName, firstName, email, password }) as any);
    }
  };

  const inputStyles = {
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
  };

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
            Create Account
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'var(--color-text-muted)',
            }}
          >
            Join LeafyLane and start shopping
          </Typography>
        </Box>

        {/* Error Messages */}
        {message && (
          <Box sx={{ mb: 3 }}>
            <Message variant="danger">{message}</Message>
          </Box>
        )}
        {error && (
          <Box sx={{ mb: 3 }}>
            <Message variant="danger">{JSON.stringify(error)}</Message>
          </Box>
        )}

        {/* Registration Form */}
        <form onSubmit={registerHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                sx={inputStyles}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={inputStyles}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={inputStyles}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={inputStyles}
            />
          </Box>

          <Box sx={{ mt: 2, mb: 4 }}>
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={inputStyles}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <PersonAddOutlinedIcon />}
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
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }} />

        {/* Login Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{" "}
            <Link
              href={redirect ? `/login?redirect=${redirect}` : "/login"}
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Full Page Loader */}
      {loading && <FullPageLoader />}
    </Container>
  );
};

export default RegisterScreen;