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
  Divider,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

const CartScreen = () => {
  const router = useRouter();
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.user);
  const { cart, loading, error } = useSelector((state: any) => state.cart);

  useEffect(() => {
    const fetchCartDetails = async () => {
      if (!userInfo) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      await dispatch(getCartDetails() as any);
    };

    fetchCartDetails();
  }, [dispatch, userInfo, router]);

  const checkoutHandler = () => {
    router.push("/login?redirect=shipping");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error ? (
        <Message variant="danger">{JSON.stringify(error)}</Message>
      ) : (
        <>
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: 'var(--color-primary)', mr: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Shopping Cart
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Cart Items Section */}
            <Box sx={{ flex: { md: 2 }, width: '100%' }}>
              {!cart?.data?.cartItems?.length ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px dashed var(--color-border-main)',
                    backgroundColor: 'var(--color-bg-subtle)',
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'var(--color-text-muted)', mb: 2 }}>
                    Your cart is empty
                  </Typography>
                  <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      sx={{
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-primary)',
                        '&:hover': {
                          borderColor: 'var(--color-primary-dark)',
                          backgroundColor: 'rgba(45, 106, 79, 0.04)',
                        },
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </Paper>
              ) : (
                <Box>
                  {cart.data.cartItems.map((item: any) => (
                    <CartItem key={item.productId} item={item} addToCart={() => { }} />
                  ))}
                  <Box sx={{ mt: 3 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                      <Button
                        startIcon={<ArrowBackIcon />}
                        sx={{
                          color: 'var(--color-primary)',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Summary Section */}
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
                  <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
                    Subtotal ({cart?.data?.cartItems?.length || 0} items)
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    ${cart?.data?.totalPrice ?? 0}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 3 }}>
                  Shipping and taxes calculated at checkout.
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!cart?.data?.cartItems?.length}
                  onClick={checkoutHandler}
                  startIcon={<ShoppingCartCheckoutIcon />}
                  sx={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-dark)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'var(--shadow-green)',
                    },
                    '&:disabled': {
                      backgroundColor: 'var(--color-border-main)',
                    },
                    transition: 'all var(--transition-base)',
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Paper>
            </Box>
          </Box>
        </>
      )}
      {loading && <FullPageLoader />}
    </Container>
  );
};

export default CartScreen;