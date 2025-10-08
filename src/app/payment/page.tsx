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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { savePaymentMethodId } from "@/store/slices/orderSlice";
import { fetchPaymentMethods, savePaymentMethod } from "@/store/slices/paymentSlice";
import CheckoutSteps from "@/components/CheckoutSteps";
import Loader from "@/components/Loader";
import Message from "@/components/Message";

const PaymentScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
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
  const [message, setMessage] = useState(null);

  const { success, loading: saveLoading, error: saveError } = useSelector((state) => state.payment.savePayment);
  const { paymentMethods, loading: listLoading, error: listError } = useSelector((state) => state.payment.listPaymentMethods);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  const proceedToPlaceOrder = () => {
    dispatch(savePaymentMethodId(paymentMethodId));
    router.push("/placeorder");
  };

  const saveCard = async () => {
    const cardRequestBody = {
      card: { cardNumber, expirationMonth, expirationYear, cvv },
    };
    await dispatch(savePaymentMethod(cardRequestBody));
    dispatch(fetchPaymentMethods());
  };

  return (
    <Box className="max-w-4xl mx-auto px-4 py-8">
      {/* Checkout Steps */}
      <CheckoutSteps step1 step2 step3 />

      {/* Page Title */}
      <Typography variant="h4" className="font-bold text-gray-800 mb-6 text-center">
        Payment Method
      </Typography>
      <hr className="mb-6" />

      {/* Error Messages */}
      {(saveError || listError) && <Message variant="danger">{saveError || listError}</Message>}
      {message && <Message variant="danger">{message}</Message>}

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Select Payment Method */}
        <Box>
          {listLoading ? (
            <Loader />
          ) : (
            <>
              <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                Select Payment Method
              </Typography>
              <RadioGroup value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)}>
                {paymentMethods.map((a) => (
                  <Card key={a.paymentMethodId} className="mb-4 shadow-md">
                    <CardContent>
                      <FormControlLabel
                        value={a.paymentMethodId}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1" className="font-bold text-gray-800">
                              {a.cardType}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600">
                              **** **** **** {a.cardLast4Digits} - {a.cardExpirationMonth}/{a.cardExpirationYear}
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </>
          )}
        </Box>

        {/* Add New Card */}
        <Box>
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Add New Card
          </Typography>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              label="Card Number"
              fullWidth
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="mb-4"
            />
            <Box className="grid grid-cols-2 gap-4">
              <TextField
                label="Expiration Month"
                fullWidth
                required
                value={expirationMonth}
                onChange={(e) => setExpirationMonth(e.target.value)}
                className="mb-4"
              />
              <TextField
                label="Expiration Year"
                fullWidth
                required
                value={expirationYear}
                onChange={(e) => setExpirationYear(e.target.value)}
                className="mb-4"
              />
            </Box>
            <TextField
              label="CVV"
              fullWidth
              required
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="mb-4"
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              onClick={saveCard}
              disabled={saveLoading}
            >
              {saveLoading ? <CircularProgress size={24} /> : "Add Card"}
            </Button>
          </form>
        </Box>
      </Box>

      <hr className="my-6" />

      {/* Proceed to Place Order */}
      <Box className="text-center">
        <Button
          variant="contained"
          color="success"
          onClick={proceedToPlaceOrder}
          disabled={!paymentMethodId}
        >
          Proceed to Place Order
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentScreen;