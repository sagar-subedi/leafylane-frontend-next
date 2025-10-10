"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, CircularProgress, Divider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { getOrderDetailsAction } from "@/store/slices/orderSlice";
import OrderItem from "@/components/OrderItem";
import { isAdmin } from "@/utils/CommonUtils";

const OrderScreen = () => {
  const router = useRouter();
  const { id: orderId } = useParams();

  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  const orderDetail = useSelector((state) => state.order.orderDetails);
  const { order, loading, error } = orderDetail;

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    } else {
      dispatch(getOrderDetailsAction(orderId));
    }
  }, [dispatch, orderId, userInfo, router]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return (
    <Box className="max-w-6xl mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Typography variant="h4" className="font-bold text-gray-800 mb-6">
            Order - {order.orderId}
          </Typography>
          <Divider className="mb-6" />

          <Box className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order Details */}
            <Box className="col-span-2">
              <Card className="shadow-md mb-6">
                <CardContent>
                  <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                    Shipping
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4">
                    <strong>Name:</strong> {userInfo?.userName}
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4">
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${userInfo?.email}`} className="text-blue-600">
                      {userInfo?.email}
                    </a>
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4">
                    <strong>Address:</strong> {order.shippingAddress?.addressLine1},{" "}
                    {order.shippingAddress?.city} {order.shippingAddress?.postalCode},{" "}
                    {order.shippingAddress?.country}
                  </Typography>
                  {order.delivered ? (
                    <Message variant="success">Delivered on {order.deliveredAt}</Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-md mb-6">
                <CardContent>
                  <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                    Payment Method
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4">
                    <strong>Method:</strong> {order.card?.cardBrand.toUpperCase()} - **** **** ****{" "}
                    {order.card?.last4Digits}
                  </Typography>
                  {order.paid ? (
                    <Message variant="success">Paid on {order.paymentDate}</Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                  <Typography variant="body1" className="text-gray-600">
                    <strong>Payment Receipt:</strong>{" "}
                    <a
                      href={order.paymentReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      {order.paymentReceiptUrl}
                    </a>
                  </Typography>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent>
                  <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                    Order Items
                  </Typography>
                  {order.orderItems?.length === 0 ? (
                    <Message>Order is empty</Message>
                  ) : (
                    <Box className="space-y-4">
                      {order.orderItems?.map((item) => (
                        <OrderItem key={item.productId} item={item} />
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
                      ${order.itemsTotalPrice}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between mb-4">
                    <Typography variant="body1" className="text-gray-600">
                      Shipping
                    </Typography>
                    <Typography variant="body1" className="font-bold text-gray-800">
                      ${order.shippingPrice}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between mb-4">
                    <Typography variant="body1" className="text-gray-600">
                      Tax
                    </Typography>
                    <Typography variant="body1" className="font-bold text-gray-800">
                      ${order.taxPrice}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between mb-4">
                    <Typography variant="body1" className="text-gray-600">
                      Total
                    </Typography>
                    <Typography variant="body1" className="font-bold text-gray-800">
                      ${order.totalPrice}
                    </Typography>
                  </Box>
                  {loadingDeliver && <Loader />}
                  {isAdmin() && order.paid && !order.delivered && (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default OrderScreen;