"use client";

// import React, { useEffect } from 'react';
// import Link from 'next/link';
// import { useDispatch, useSelector } from 'react-redux';
// import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
// import Message from '@/components/Message';
// import CartItem from '@/components/CartItem';
// import FullPageLoader from '@/components/FullPageLoader';
// import { getCartDetails } from '@/store/slices/cartSlice';

// const CartScreen = (props) => {
//   const productId = props.match.params.id;
//   const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
//   const dispatch = useDispatch();
//   const userLogin = useSelector((state) => state.userLogin);
//   const cartState = useSelector((state) => state.cart);
//   const { cart } = cartState;
//   let loading = cartState.loading;
//   let error = cartState.error;
//   const { userInfo } = userLogin;
//   const redirect = props.location.pathname + props.location.search;

//   useEffect(() => {
//     if (userInfo === null || userInfo === undefined) {
//       props.history.push(`/login?redirect=${redirect}`);
//       return;
//     }
//     if (productId) {
//       addToCart();
//     } else {
//       getCartDetail();
//     }
//   }, [dispatch, productId, qty, userInfo]);

//   const addToCart = (pId, q) => {
//     const addToCartRequestBody = {
//       productId: pId || productId,
//       quantity: q || qty
//     };
//     dispatch(addToCart(addToCartRequestBody));
//   };

//   const getCartDetail = () => {
//     dispatch(getCartDetails());
//   };

//   const checkoutHandler = () => {
//     props.history.push('/login?redirect=shipping');
//   };

//   return (
//     <>
//       {error ? (
//         <Message variant='danger'> {JSON.stringify(error.message)}</Message>
//       ) : (
//         <>
//           <Row>
//             <h1>Shopping Cart</h1>
//           </Row>
//           <Row>
//             <Col md={8}>
//               {cart == null || cart?.cartItems?.length == 0 ? (
//                 <Message>
//                   Your cart is empty <Link href='/'>Go Back</Link>
//                 </Message>
//               ) : (
//                 <ListGroup.Item variant='flush'>
//                   {cart?.cartItems?.map((item) => (
//                     <CartItem key={item.productId} item={item} addToCart={addToCart}></CartItem>
//                   ))}
//                 </ListGroup.Item>
//               )}
//               <Row className='m-5 justify-content-md-center'>
//                 <Link href={'/'}>
//                   <a>Add more books</a>
//                 </Link>
//               </Row>
//             </Col>
//             <Col md={4}>
//               <Card>
//                 <ListGroup variant='flush'>
//                   <ListGroup.Item>
//                     <h3>Subtotal ({cart?.cartItems?.length}) Items</h3>
//                   </ListGroup.Item>
//                   <ListGroup.Item>
//                     <h3>${cart?.totalPrice}</h3>
//                   </ListGroup.Item>
//                   <ListGroup.Item>
//                     <Button type='button' className='btn-block' disabled={cart?.cartItems?.length === 0} onClick={checkoutHandler}>
//                       Proceed To Checkout
//                     </Button>
//                   </ListGroup.Item>
//                 </ListGroup>
//               </Card>
//             </Col>
//           </Row>
//         </>
//       )}
//       {loading && <FullPageLoader></FullPageLoader>}
//     </>
//   );
// };

// export default CartScreen;

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Button, Card } from "react-bootstrap";
import Message from "@/components/Message";
import CartItem from "@/components/CartItem";
import FullPageLoader from "@/components/FullPageLoader";
import { getCartDetails, addToCart } from "@/store/slices/cartSlice";

const CartScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qty = Number(searchParams.get("qty")) || 1;
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { cart, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (!userInfo) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      if (productId) {
        await dispatch(addToCart({ productId, quantity: qty }));
      } else {
        await dispatch(getCartDetails());
      }
    };

    fetchCartDetails();
  }, [dispatch, productId, qty, userInfo, router]);

  const checkoutHandler = () => {
    router.push("/login?redirect=shipping");
  };

  return (
    <>
      {error ? (
        <Message variant="danger">{JSON.stringify(error)}</Message>
      ) : (
        <>
          <Row>
            <h1>Shopping Cart</h1>
          </Row>
          <Row>
            <Col md={8}>
              {!cart?.data?.cartItems?.length ? (
                <Message>
                  Your cart is empty <Link href="/">Go Back</Link>
                </Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.data.cartItems.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </ListGroup>
              )}
              <Row className="m-5 justify-content-md-center">
                <Link href="/">Add more Stuffs</Link>
              </Row>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>Subtotal ({cart?.data?.cartItems?.length}) Items</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h3>${cart?.data?.totalPrice ?? 0}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn-block"
                      disabled={!cart?.data?.cartItems?.length}
                      onClick={checkoutHandler}
                    >
                      Proceed To Checkout
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
      {loading && <FullPageLoader />}
    </>
  );
};

export default CartScreen;

