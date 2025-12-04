"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  Grid,
  Paper,
  Divider,
  Alert
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { savePaymentMethodId } from "@/store/slices/orderSlice";
import { fetchPaymentMethods, savePaymentMethod } from "@/store/slices/paymentSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import Loader from "@/components/Loader";
import Message from "@/components/Message";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AddCardIcon from '@mui/icons-material/AddCard';

const PaymentScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const order = useSelector((state: any) => state.order);
  const { shippingAddressId } = order;

  useEffect(() => {
    if (!shippingAddressId) {
      router.push("/shipping");
    }
  }, [shippingAddressId, router]);

  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [cardNumber, setCardNumber] = useState("4242424242424242");
  const [expirationMonth, setExpirationMonth] = useState("10");
  const [expirationYear, setExpirationYear] = useState("26");
  const [cvv, setCvv] = useState("123");
  const [message, setMessage] = useState<string | null>(null);

  const { success, loading: saveLoading, error: saveError } = useSelector((state: any) => state.payment.savePayment);
  const { paymentMethods, loading: listLoading, error: listError } = useSelector((state: any) => state.payment.listPaymentMethods);

  useEffect(() => {
    dispatch(fetchPaymentMethods() as any);
  }, [dispatch]);

  // Set default payment method if available
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !paymentMethodId) {
      setPaymentMethodId(paymentMethods[0].paymentMethodId);
    }
  }, [paymentMethods, paymentMethodId]);

  const proceedToPlaceOrder = () => {
    if (!paymentMethodId) {
      setMessage("Please select a payment method");
      return;
    }
    dispatch(savePaymentMethodId(paymentMethodId));
    router.push("/placeorder");
  };

  const saveCard = async () => {
    const cardRequestBody = {
      card: { cardNumber, expirationMonth, expirationYear, cvv },
    };
    await dispatch(savePaymentMethod(cardRequestBody) as any);
    dispatch(fetchPaymentMethods() as any);
    // Clear sensitive data after save (optional, but good practice)
    // setCardNumber("");
    // setCvv("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <CheckoutSteps step1 step2 step3 />

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-md)',
              height: '100%'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PaymentIcon sx={{ color: 'var(--color-primary)', mr: 1.5, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                Select Payment Method
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {listLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: 'var(--color-primary)' }} />
              </Box>
            ) : (
              <>
                {(saveError || listError) && (
                  <Box sx={{ mb: 3 }}>
                    <Message variant="danger">{saveError || listError}</Message>
                  </Box>
                )}
                {message && (
                  <Box sx={{ mb: 3 }}>
                    <Message variant="danger">{message}</Message>
                  </Box>
                )}

                {paymentMethods?.length === 0 ? (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    No payment methods found. Please add a new card.
                  </Alert>
                ) : (
                  <RadioGroup value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {paymentMethods?.map((a: any) => (
                        <Card
                          key={a.paymentMethodId}
                          sx={{
                            border: paymentMethodId === a.paymentMethodId ? '2px solid var(--color-primary)' : '1px solid var(--color-border-main)',
                            backgroundColor: paymentMethodId === a.paymentMethodId ? 'rgba(45, 106, 79, 0.05)' : 'white',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              borderColor: 'var(--color-primary)',
                              boxShadow: 'var(--shadow-sm)'
                            }
                          }}
                          onClick={() => setPaymentMethodId(a.paymentMethodId)}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <FormControlLabel
                              value={a.paymentMethodId}
                              control={<Radio sx={{ color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } }} />}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CreditCardIcon sx={{ mr: 2, color: 'text.secondary' }} />
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {a.cardType || 'Credit Card'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      **** **** **** {a.cardLast4Digits} • Exp: {a.cardExpirationMonth}/{a.cardExpirationYear}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                              sx={{ width: '100%', m: 0 }}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </RadioGroup>
                )}
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-md)',
              bgcolor: '#fafafa'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AddCardIcon sx={{ color: 'var(--color-primary)', mr: 1.5, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                Add New Card
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />

            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Card Number"
                    fullWidth
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <CreditCardIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Exp Month (MM)"
                    fullWidth
                    required
                    value={expirationMonth}
                    onChange={(e) => setExpirationMonth(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Exp Year (YY)"
                    fullWidth
                    required
                    value={expirationYear}
                    onChange={(e) => setExpirationYear(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="CVV"
                    fullWidth
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    variant="outlined"
                    size="small"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={saveCard}
                    disabled={saveLoading}
                    sx={{
                      mt: 2,
                      bgcolor: 'var(--color-primary)',
                      '&:hover': { bgcolor: 'var(--color-primary-dark)' },
                      py: 1.5
                    }}
                  >
                    {saveLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Add Card"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={proceedToPlaceOrder}
              disabled={!paymentMethodId}
              endIcon={<PaymentIcon />}
              sx={{
                bgcolor: 'var(--color-accent)',
                '&:hover': { bgcolor: '#40916C' },
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              Proceed to Place Order
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentScreen;