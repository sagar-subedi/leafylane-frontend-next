"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, CircularProgress, Divider, Typography, Container, Paper, Grid, Chip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { getOrderDetailsAction, deliverOrderAction, resetDeliverOrder } from "@/store/slices/orderSlice";
import OrderItem from "@/components/OrderItem";
import { isAdmin } from "@/utils/CommonUtils";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const OrderScreen = () => {
  const router = useRouter();
  const { id: orderId } = useParams();

  const dispatch = useDispatch();
  const userLogin = useSelector((state: any) => state.user);
  const { userInfo } = userLogin;

  const orderDetail = useSelector((state: any) => state.order.orderDetails);
  const { order, loading, error } = orderDetail;

  const deliverOrderState = useSelector((state: any) => state.order.deliverOrder);
  const { loading: loadingDeliver, success: successDeliver } = deliverOrderState;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      dispatch(getOrderDetailsAction(orderId as string) as any);
    }
  }, [dispatch, orderId, userInfo, router]);

  useEffect(() => {
    if (successDeliver) {
      dispatch(getOrderDetailsAction(orderId as string) as any);
      dispatch(resetDeliverOrder());
    }
  }, [dispatch, successDeliver, orderId]);

  const deliverHandler = () => {
    dispatch(deliverOrderAction(order.orderId) as any);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <ReceiptLongIcon sx={{ fontSize: 32, color: 'var(--color-primary)', mr: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Order Details
            </Typography>
            <Typography variant="h6" sx={{ ml: 2, color: 'var(--color-text-muted)', fontWeight: 400 }}>
              #{order.orderId}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Order Details Column */}
            <Box sx={{ flex: { md: 2 }, width: '100%' }}>
              {/* Shipping Info */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid var(--color-border-light)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShippingIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Shipping
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {userInfo?.userName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> <a href={`mailto:${userInfo?.email}`} style={{ color: 'var(--color-primary)' }}>{userInfo?.email}</a>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Address:</strong> {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                  </Typography>

                  {order.delivered ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={`Delivered on ${order.deliveredAt}`}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label="Not Delivered"
                      color="error"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Paper>

              {/* Payment Info */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid var(--color-border-light)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Payment Method
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Method:</strong> {order.card?.cardBrand.toUpperCase()} - **** **** **** {order.card?.last4Digits}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {order.paid ? (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={`Paid on ${order.paymentDate}`}
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : (
                      <Chip
                        icon={<CancelIcon />}
                        label="Not Paid"
                        color="error"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  {order.paymentReceiptUrl && (
                    <Typography variant="body1">
                      <strong>Receipt:</strong> <a href={order.paymentReceiptUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>View Receipt</a>
                    </Typography>
                  )}
                </Box>
              </Paper>

              {/* Order Items */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid var(--color-border-light)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-text-primary)' }}>
                  Order Items
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {order.orderItems?.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <Box>
                    {order.orderItems?.map((item: any) => (
                      <OrderItem key={item.productId} item={item} />
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>

            {/* Order Summary Column */}
            <Box sx={{ flex: { md: 1 }, width: '100%' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid var(--color-border-light)',
                  position: { md: 'sticky' },
                  top: { md: 100 },
                  backgroundColor: 'var(--color-bg-subtle)',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-text-primary)' }}>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>Items</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>${order.itemsTotalPrice}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>Shipping</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>${order.shippingPrice}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>Tax</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>${order.taxPrice}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>${order.totalPrice}</Typography>
                </Box>

                {loadingDeliver && <Loader />}
                {isAdmin() && order.paid && !order.delivered && (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={deliverHandler}
                    sx={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      fontWeight: 600,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'var(--color-primary-dark)',
                        boxShadow: 'var(--shadow-green)',
                      },
                    }}
                  >
                    Mark As Delivered
                  </Button>
                )}
              </Paper>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default OrderScreen;


