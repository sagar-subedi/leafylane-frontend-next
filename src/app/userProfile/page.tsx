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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listMyOrdersAction } from "@/store/slices/orderSlice";
import { getUserDetails, updateUserProfile } from "@/store/slices/userSlice";
import FullPageLoader from "@/components/FullPageLoader";
import Message from "@/components/Message";
import { USER_UPDATE_PROFILE_RESET } from "@/constants/userConstants";

const ProfileScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.user.getUserDetails);
  const { error: errorUserDetails, loading: loadingUserDetails, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.user.updateUser);
  const { error: errorUpdateUserDetails, loading: loadingUpdateUserDetails, success } = userUpdateProfile;

  const orderListMy = useSelector((state) => state.order.listMyOrders);
  const { error: errorOrderListMy, loading: loadingOrderListMy, orders } = orderListMy;

  useEffect(() => {
    // if (!userInfo) {
    //   router.push("/login");
    // } else {
    //   if (!user || !user.userName) {
    //     dispatch({ type: USER_UPDATE_PROFILE_RESET });
    //     dispatch(getUserDetails());
    //   } else {
    //     setFirstName(user.firstName);
    //     setLastName(user.lastName);
    //     setEmail(user.email);
    //   }
    // }
    // dispatch(listMyOrdersAction());
  }, [dispatch, router, userInfo, user]);

  const userProfileUpdateHandler = (e) => {
    e.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ firstName, lastName, email, password }));
    }
  };

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Form */}
        <Box>
          <Typography variant="h5" className="font-bold text-gray-800 mb-6">
            User Profile
          </Typography>
          {message && <Message variant="danger">{message}</Message>}
          {success && <Message variant="success">Profile Updated</Message>}
          {(errorUserDetails || errorUpdateUserDetails) && (
            <Message variant="danger">{errorUserDetails || errorUpdateUserDetails}</Message>
          )}
          <form onSubmit={userProfileUpdateHandler}>
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
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Box>
            <Box className="mb-4">
              <TextField
                label="Email Address"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loadingUpdateUserDetails}
            >
              {loadingUpdateUserDetails ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </form>
        </Box>

        {/* My Orders */}
        <Box className="col-span-2">
          <Typography variant="h5" className="font-bold text-gray-800 mb-6">
            My Orders
          </Typography>
          {errorOrderListMy ? (
            <Message variant="danger">{errorOrderListMy}</Message>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Delivered</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.created_at}</TableCell>
                      <TableCell>${order.totalPrice}</TableCell>
                      <TableCell>
                        {order.paid ? (
                          order.paymentDate?.substring(0, 10)
                        ) : (
                          <i className="fas fa-times text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {order.delivered ? (
                          order.deliveredDate?.substring(0, 10)
                        ) : (
                          <i className="fas fa-times text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Link href={`/order/${order.orderId}`} passHref>
                          <Button variant="outlined" size="small">
                            Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Full Page Loader */}
      {(loadingUserDetails || loadingUpdateUserDetails || loadingOrderListMy) && <FullPageLoader />}
    </Box>
  );
};

export default ProfileScreen;