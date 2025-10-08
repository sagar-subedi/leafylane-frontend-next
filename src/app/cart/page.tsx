"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import CartItem from "@/components/CartItem";
import FullPageLoader from "@/components/FullPageLoader";
import { getCartDetails } from "@/store/slices/cartSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const CartScreen = () => {
  const router = useRouter();
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

      await dispatch(getCartDetails());
    };

    fetchCartDetails();
  }, [dispatch, userInfo, router]);

  const checkoutHandler = () => {
    router.push("/login?redirect=shipping");
  };

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      {error ? (
        <Message variant="danger">{JSON.stringify(error)}</Message>
      ) : (
        <>
          {/* Page Title */}
          <Typography variant="h4" className="font-bold text-gray-800 mb-6">
            Shopping Cart
          </Typography>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="flex-1">
              {!cart?.data?.cartItems?.length ? (
                <Message>
                  Your cart is empty. <Link href="/" className="text-blue-600">Go Back</Link>
                </Message>
              ) : (
                <div className="space-y-4">
                  {cart.data.cartItems.map((item) => (
                    <CartItem key={item.productId} item={item} addToCart={undefined} />
                  ))}
                </div>
              )}
              <div className="mt-6">
                <Link href="/" className="text-blue-600 underline">
                  Add more items
                </Link>
              </div>
            </div>

            {/* Summary Section */}
            <div className="w-full md:w-1/3">
              <Card className="shadow-md">
                <CardContent>
                  <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                    Order Summary
                  </Typography>
                  <Divider className="mb-4" />
                  <div className="flex justify-between mb-4">
                    <Typography variant="body1" className="text-gray-600">
                      Subtotal ({cart?.data?.cartItems?.length} items):
                    </Typography>
                    <Typography variant="body1" className="font-bold text-gray-800">
                      ${cart?.data?.totalPrice ?? 0}
                    </Typography>
                  </div>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={!cart?.data?.cartItems?.length}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
      {loading && <FullPageLoader />}
    </Box>
  );
};

export default CartScreen;