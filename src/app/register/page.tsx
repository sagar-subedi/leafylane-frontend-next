"use client";

import { Suspense } from 'react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '@/components/Message';
import { register } from '@/store/slices/userSlice';
import FormContainer from '@/components/FormContainer';
import FullPageLoader from '@/components/FullPageLoader';
import { USER_REGISTER_RESET } from '@/constants/userConstants';
import { useSearchParams } from 'next/navigation';

const RegisterScreen = (props) => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.user.register);
  const { loading, error, userInfo } = userRegister;

  const params = useSearchParams();
  const redirect = params.get("redirect") || "/"

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, userInfo, redirect]);

  const registerHandler = (e) => {
    setMessage(null);
    e.preventDefault();
    //Register
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      dispatch({ type: USER_REGISTER_RESET });
    } else {
      dispatch(register({userName, firstName, email, password}));
    }
  };

  return (
   <Suspense fallback={<div>Loading...</div>}>
     <div>
      <FormContainer>
        <h1>Sign Up</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{JSON.stringify(error)}</Message>}
        <Form onSubmit={registerHandler}>
          <Form.Group controlId='userName'>
            <Form.Label>Username</Form.Label>
            <Form.Control required placeholder='Username' value={userName} onChange={(e) => setUserName(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='firstName'>
            <Form.Label>First Name</Form.Label>
            <Form.Control required placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control required type='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              placeholder='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              placeholder='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Register
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            Have an Account? <Link href={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
          </Col>
        </Row>
      </FormContainer>
      {loading && <FullPageLoader></FullPageLoader>}
    </div>
   </Suspense>
  );
};

export default RegisterScreen;
