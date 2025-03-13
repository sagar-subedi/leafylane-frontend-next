"use client"
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listMyOrdersAction } from '@/store/slices/orderSlice';
import { getUserDetails, updateUserProfile } from '@/store/slices/userSlice';
import FullPageLoader from '@/components/FullPageLoader';
import Message from '@/components/Message';
import { USER_UPDATE_PROFILE_RESET } from '@/constants/userConstants';

const ProfileScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

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
    //   router.push('/login');
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
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile({ firstName, lastName, email, password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {(errorUserDetails || errorUpdateUserDetails) && (
          <Message variant='danger'>{errorUserDetails || errorUpdateUserDetails}</Message>
        )}
        <Form onSubmit={userProfileUpdateHandler}>
          <Form.Group controlId='firstName' className='mb-3'>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='lastName' className='mb-3'>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='email' className='mb-3'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='confirmPassword' className='mb-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {errorOrderListMy ? (
          <Message variant='danger'>{errorOrderListMy}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.created_at}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.paid ? (
                      order.paymentDate?.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    {order.delivered ? (
                      order.deliveredDate?.substring(0, 10)
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <Link href={`/order/${order.orderId}`} passHref legacyBehavior>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
      {(loadingUserDetails || loadingUpdateUserDetails || loadingOrderListMy) && <FullPageLoader />}
    </Row>
  );
};

export default ProfileScreen;