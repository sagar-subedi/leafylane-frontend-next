"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { placeOrderAction, previewOrderAction } from "@/store/slices/orderSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import FullPageLoader from "@/components/FullPageLoader";
import Loader from "@/components/Loader";
import Message from "@/components/Message";
import OrderItem from "@/components/OrderItem";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState(null);

  const order = useSelector((state: any) => state.order);
  const { shippingAddressId, billingAddressId, paymentMethodId } = order;

  const orderPreview = useSelector((state: any) => state.order.previewOrder);
  const { loading: previewOrderLoading, order: previewOrderResponse } = orderPreview;

  const orderCreate = useSelector((state: any) => state.order.createOrder);
  const { loading: placeOrderLoading, order: createOrderResponse } = orderCreate;

  // Redirect if required fields are missing
  useEffect(() => {
    if (!shippingAddressId) {
      router.push("/shipping");
    } else if (!billingAddressId) {
      router.push("/shipping");
    } else if (!paymentMethodId) {
      router.push("/payment");
    }
  }, [shippingAddressId, billingAddressId, paymentMethodId, router]);

  // Function to preview order
  const previewOrder = useCallback(() => {
    if (shippingAddressId && billingAddressId && paymentMethodId) {
      dispatch(previewOrderAction({ billingAddressId, shippingAddressId, paymentMethodId }) as any);
    }
  }, [dispatch, billingAddressId, shippingAddressId, paymentMethodId]);

  // Fetch order preview
  useEffect(() => {
    previewOrder();
  }, [previewOrder]);

  // Handle order creation response
  useEffect(() => {
    if (createOrderResponse?.orderId) {
      dispatch({ type: "ORDER_CREATE_RESET" });
      router.push(`/order/${createOrderResponse.orderId}`);
    }
  }, [dispatch, createOrderResponse, router]);

  // Place order handler
  const placeOrderHandler = () => {
    dispatch(placeOrderAction({ billingAddressId, shippingAddressId, paymentMethodId }) as any);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CheckoutSteps step1 step2 step3 step4 />

      {previewOrderLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Shipping Details */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid var(--color-border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShippingIcon sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                    Shipping
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  <strong>Address:</strong> {previewOrderResponse?.shippingAddress?.addressLine1},{" "}
                  {previewOrderResponse?.shippingAddress?.city}{" "}
                  {previewOrderResponse?.shippingAddress?.postalCode},{" "}
                  {previewOrderResponse?.shippingAddress?.country}
                </Typography>
              </Paper>

              {/* Payment Method */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid var(--color-border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                    Payment Method
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    <strong>Method:</strong> {previewOrderResponse?.card?.cardBrand?.toUpperCase() || 'Credit Card'}
                  </Typography>
                  {previewOrderResponse?.card?.last4Digits && (
                    <Chip
                      label={`**** ${previewOrderResponse?.card?.last4Digits}`}
                      size="small"
                      sx={{ ml: 2, bgcolor: 'rgba(45, 106, 79, 0.1)', color: 'var(--color-primary)', fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Paper>

              {/* Order Items */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid var(--color-border-light)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingBagIcon sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                    Order Items
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {!previewOrderResponse?.orderItems?.length ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {previewOrderResponse?.orderItems?.map((item: any, index: number) => (
                      <Box key={index} sx={{ borderBottom: index !== previewOrderResponse.orderItems.length - 1 ? '1px solid #f0f0f0' : 'none', pb: index !== previewOrderResponse.orderItems.length - 1 ? 2 : 0 }}>
                        <OrderItem item={item} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: '1px solid var(--color-border-light)',
                boxShadow: 'var(--shadow-md)',
                position: 'sticky',
                top: 20
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptLongIcon sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                  Order Summary
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">Items</Typography>
                <Typography variant="body1" fontWeight={600}>${previewOrderResponse?.itemsTotalPrice?.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">Shipping</Typography>
                <Typography variant="body1" fontWeight={600}>${previewOrderResponse?.shippingPrice?.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">Tax</Typography>
                <Typography variant="body1" fontWeight={600}>${previewOrderResponse?.taxPrice?.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={700} color="var(--color-primary)">${previewOrderResponse?.totalPrice?.toFixed(2)}</Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!previewOrderResponse?.orderItems?.length || placeOrderLoading}
                onClick={placeOrderHandler}
                startIcon={placeOrderLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                sx={{
                  bgcolor: '#52B788',
                  color: '#ffffff',
                  '&:hover': { bgcolor: '#40916C' },
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-md)',
                  textTransform: 'none'
                }}
              >
                {placeOrderLoading ? "Processing..." : "Place Order"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
      {placeOrderLoading && <FullPageLoader />}
    </Container>
  );
};

export default PlaceOrderScreen;