"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listMyOrdersAction } from "@/store/slices/orderSlice";
import { getUserDetails, updateUserProfile } from "@/store/slices/userSlice";
import FullPageLoader from "@/components/FullPageLoader";
import Message from "@/components/Message";
import { USER_UPDATE_PROFILE_RESET } from "@/constants/userConstants";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ProfileScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state: any) => state.user);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state: any) => state.user.getUserDetails);
  const { error: errorUserDetails, loading: loadingUserDetails, user } = userDetails;

  const userUpdateProfile = useSelector((state: any) => state.user.updateUser);
  const { error: errorUpdateUserDetails, loading: loadingUpdateUserDetails, success } = userUpdateProfile;

  const orderListMy = useSelector((state: any) => state.order.listMyOrders);
  const { error: errorOrderListMy, loading: loadingOrderListMy, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      if (!user || !user.userName) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails() as any);
      } else {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
      }
    }
  }, [dispatch, router, userInfo, user]);

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyOrdersAction() as any);
    }
  }, [dispatch, userInfo]);

  const userProfileUpdateHandler = (e: any) => {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ firstName, lastName, email, password }) as any);
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4} className="animate-fadeIn">
        {/* User Profile Form */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonOutlineIcon sx={{ fontSize: 28, color: 'var(--color-primary)', mr: 1.5 }} />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                User Profile
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {message && (
              <Box sx={{ mb: 2 }}>
                <Message variant="danger">{message}</Message>
              </Box>
            )}
            {success && (
              <Box sx={{ mb: 2 }}>
                <Message variant="success">Profile Updated</Message>
              </Box>
            )}
            {(errorUserDetails || errorUpdateUserDetails) && (
              <Box sx={{ mb: 2 }}>
                <Message variant="danger">{errorUserDetails || errorUpdateUserDetails}</Message>
              </Box>
            )}

            <form onSubmit={userProfileUpdateHandler}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={inputStyles}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={inputStyles}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={inputStyles}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={inputStyles}
                  placeholder="Leave blank to keep current"
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  fullWidth
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
                disabled={loadingUpdateUserDetails}
                startIcon={loadingUpdateUserDetails ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveOutlinedIcon />}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  fontWeight: 600,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
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
                {loadingUpdateUserDetails ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* My Orders */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ShoppingBagOutlinedIcon sx={{ fontSize: 28, color: 'var(--color-primary)', mr: 1.5 }} />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                My Orders
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {errorOrderListMy ? (
              <Message variant="danger">{errorOrderListMy}</Message>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Paid</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Delivered</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders?.map((order: any) => (
                      <TableRow
                        key={order.orderId}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'var(--color-bg-subtle)',
                          },
                        }}
                      >
                        <TableCell sx={{ color: 'var(--color-text-muted)' }}>
                          #{order.orderId.substring(0, 8)}
                        </TableCell>
                        <TableCell sx={{ color: 'var(--color-text-muted)' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                          ${order.totalPrice}
                        </TableCell>
                        <TableCell>
                          {order.paid ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label={new Date(order.paymentDate).toLocaleDateString()}
                              color="success"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            <Chip
                              icon={<CancelIcon />}
                              label="Not Paid"
                              color="error"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {order.delivered ? (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label={new Date(order.deliveredDate).toLocaleDateString()}
                              color="success"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            <Chip
                              icon={<CancelIcon />}
                              label="Not Delivered"
                              color="warning"
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            component={Link}
                            href={`/order/${order.orderId}`}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: 'var(--color-primary)',
                              color: 'var(--color-primary)',
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: 'var(--color-primary-dark)',
                                backgroundColor: 'rgba(45, 106, 79, 0.04)',
                              },
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Full Page Loader */}
      {(loadingUserDetails || loadingUpdateUserDetails || loadingOrderListMy) && <FullPageLoader />}
    </Container>
  );
};

export default ProfileScreen;