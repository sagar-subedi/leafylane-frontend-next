"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
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
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      {previewOrderLoading ? (
        <Loader />
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Address:</strong>{" "}
                  {previewOrderResponse?.shippingAddress?.addressLine1},{" "}
                  {previewOrderResponse?.shippingAddress?.city}{" "}
                  {previewOrderResponse?.shippingAddress?.postalCode},{" "}
                  {previewOrderResponse?.shippingAddress?.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <strong>Method: </strong>
                {previewOrderResponse?.card?.cardBrand?.toUpperCase()} - **** **** ****{" "}
                {previewOrderResponse?.card?.last4Digits}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {!previewOrderResponse?.orderItems?.length ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {previewOrderResponse?.orderItems?.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <OrderItem item={item} />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${previewOrderResponse?.itemsTotalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${previewOrderResponse?.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${previewOrderResponse?.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${previewOrderResponse?.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={!previewOrderResponse?.orderItems?.length}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
      {placeOrderLoading && <FullPageLoader />}
    </>
  );
};

export default PlaceOrderScreen;
