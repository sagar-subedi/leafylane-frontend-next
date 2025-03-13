'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '@/components/Message';
import Loader from '@/components/Loader';
import { getOrderDetailsAction } from '@/store/slices/orderSlice';
import OrderItem from '@/components/OrderItem';

const OrderScreen = () => {
  const router = useRouter();
  const {id: orderId} = useParams();
  // const { id: orderId } = params; // Extracting orderId from params

  const [loadingDeliver, setLoadingDeliver] = useState(false);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  const orderDetail = useSelector((state) => state.order.orderDetails);
  const { order, loading, error } = orderDetail;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    } else {
      dispatch(getOrderDetailsAction(orderId));
    }
  }, [dispatch, orderId, userInfo, router]);

  const deliverHandler = () => {
    // dispatch(deliverOrder(order));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <h1>Order - {order.orderId}</h1>
          <hr />
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> {userInfo?.userName}
                  </p>
                  <p>
                    <strong>Email: </strong> <a href={`mailto:${userInfo?.email}`}>{userInfo?.email}</a>
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city} {order.shippingAddress?.postalCode},{' '}
                    {order.shippingAddress?.country}
                  </p>
                  {order.delivered ? (
                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                  ) : (
                    <Message variant='danger'>Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.card?.cardBrand.toUpperCase()} - **** **** **** {order.card?.last4Digits}
                  </p>
                  {order.paid ? (
                    <Message variant='success'>Paid on {order.paymentDate}</Message>
                  ) : (
                    <Message variant='danger'>Not Paid</Message>
                  )}
                  <p>
                    <strong>Payment Receipt: </strong>
                    <a href={order.paymentReceiptUrl} target='_blank' rel='noopener noreferrer'>
                      {order.paymentReceiptUrl}
                    </a>
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems?.length === 0 ? (
                    <Message>Order is empty</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order.orderItems?.map((item) => (
                        <OrderItem key={item.productId} item={item} />
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsTotalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  {loadingDeliver && <Loader />}
                  {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                    <ListGroup.Item>
                      <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                        Mark As Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default OrderScreen;
