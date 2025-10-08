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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { placeOrderAction, previewOrderAction } from "@/store/slices/orderSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import FullPageLoader from "@/components/FullPageLoader";
import Loader from "@/components/Loader";
import Message from "@/components/Message";
import OrderItem from "@/components/OrderItem";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState(null);

  const order = useSelector((state) => state.order);
  const { shippingAddressId, billingAddressId, paymentMethodId } = order;

  const orderPreview = useSelector((state) => state.order.previewOrder);
  const { loading: previewOrderLoading, order: previewOrderResponse } = orderPreview;

  const orderCreate = useSelector((state) => state.order.createOrder);
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
    dispatch(previewOrderAction({ billingAddressId, shippingAddressId, paymentMethodId }));
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
    dispatch(placeOrderAction({ billingAddressId, shippingAddressId, paymentMethodId }));
  };

  return (
    <Box className="max-w-6xl mx-auto px-4 py-8">
      {/* Checkout Steps */}
      <CheckoutSteps step1 step2 step3 step4 />

      {previewOrderLoading ? (
        <Loader />
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Details */}
          <Box className="col-span-2">
            <Card className="shadow-md">
              <CardContent>
                <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                  Shipping
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-4">
                  <strong>Address:</strong> {previewOrderResponse?.shippingAddress?.addressLine1},{" "}
                  {previewOrderResponse?.shippingAddress?.city}{" "}
                  {previewOrderResponse?.shippingAddress?.postalCode},{" "}
                  {previewOrderResponse?.shippingAddress?.country}
                </Typography>

                <Divider className="my-4" />

                <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                  Payment Method
                </Typography>
                <Typography variant="body1" className="text-gray-600 mb-4">
                  <strong>Method:</strong> {previewOrderResponse?.card?.cardBrand?.toUpperCase()} - **** **** ****{" "}
                  {previewOrderResponse?.card?.last4Digits}
                </Typography>

                <Divider className="my-4" />

                <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                  Order Items
                </Typography>
                {!previewOrderResponse?.orderItems?.length ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <Box className="space-y-4">
                    {previewOrderResponse?.orderItems?.map((item, index) => (
                      <OrderItem key={index} item={item} />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Order Summary */}
          <Box>
            <Card className="shadow-md">
              <CardContent>
                <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                  Order Summary
                </Typography>
                <Divider className="mb-4" />
                <Box className="flex justify-between mb-4">
                  <Typography variant="body1" className="text-gray-600">
                    Items
                  </Typography>
                  <Typography variant="body1" className="font-bold text-gray-800">
                    ${previewOrderResponse?.itemsTotalPrice}
                  </Typography>
                </Box>
                <Box className="flex justify-between mb-4">
                  <Typography variant="body1" className="text-gray-600">
                    Shipping
                  </Typography>
                  <Typography variant="body1" className="font-bold text-gray-800">
                    ${previewOrderResponse?.shippingPrice}
                  </Typography>
                </Box>
                <Box className="flex justify-between mb-4">
                  <Typography variant="body1" className="text-gray-600">
                    Tax
                  </Typography>
                  <Typography variant="body1" className="font-bold text-gray-800">
                    ${previewOrderResponse?.taxPrice}
                  </Typography>
                </Box>
                <Box className="flex justify-between mb-4">
                  <Typography variant="body1" className="text-gray-600">
                    Total
                  </Typography>
                  <Typography variant="body1" className="font-bold text-gray-800">
                    ${previewOrderResponse?.totalPrice}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={!previewOrderResponse?.orderItems?.length}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
      {placeOrderLoading && <FullPageLoader />}
    </Box>
  );
};

export default PlaceOrderScreen;