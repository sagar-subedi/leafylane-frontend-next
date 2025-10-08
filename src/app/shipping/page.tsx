"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Message from "@/components/Message";
import CheckoutSteps from "@/components/CheckoutSteps";
import {
  saveShippingAddressId,
  saveBillingAddressId,
} from "@/store/slices/orderSlice";
import {
  getMyAddresses,
  saveAddress,
  deleteAddress,
} from "@/store/slices/addressSlice";

const ShippingScreen = () => {
  const router = useRouter();

  const [shippingCheckbox, setShippingCheckbox] = useState(true);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [billingAddressId, setBillingAddressId] = useState("");
  const [shippingAddressId, setShippingAddressId] = useState("");

  const dispatch = useDispatch();

  const addressList = useSelector((state) => state.address.listAddresses);
  const { addresses, loading: addressListLoading, error: addressListError } =
    addressList;

  const addressSave = useSelector((state) => state.address.saveAddress);
  const { loading: addressSaveLoading, error: addressSaveError } = addressSave;

  const getShippingAddress = async () => {
    dispatch(getMyAddresses());
  };

  useEffect(() => {
    getShippingAddress();
    if (addresses?.length > 0) {
      setBillingAddressId(addresses[0].addressId);
      setShippingAddressId(addresses[0].addressId);
    }
  }, [dispatch]);

  const saveAddressHandler = async (e) => {
    e.preventDefault();
    const addressRequestBody = {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phone,
    };
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry(0);
    setPhone("");
    await dispatch(saveAddress(addressRequestBody));
    dispatch(getShippingAddress());
  };

  const proceedToPayment = () => {
    if (shippingAddressId === null || shippingAddressId === "") {
      setMessage("Shipping Address is required");
      return;
    }
    dispatch(saveShippingAddressId(shippingAddressId));
    dispatch(saveBillingAddressId(billingAddressId));
    router.push("/payment");
  };

  const deleteAddressHandler = (addressId) => {
    if (addressId === billingAddressId) {
      setBillingAddressId(null);
    }
    if (addressId === shippingAddressId) {
      setShippingAddressId(null);
    }
    dispatch(deleteAddress(addressId));
  };

  return (
    <Box className="max-w-4xl mx-auto px-4 py-8">
      {/* Checkout Steps */}
      <Box className="mb-6">
        <CheckoutSteps step1 step2 />
      </Box>

      {/* Address Section */}
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Address
      </Typography>
      <hr className="mb-6" />

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Existing Addresses */}
        <Box>
          {addressListLoading ? (
            <CircularProgress />
          ) : (
            <>
              {addressListError && (
                <Message variant="danger">
                  {JSON.stringify(addressListError)}
                </Message>
              )}
              <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                Select Billing Address
              </Typography>
              {addresses.map((a) => (
                <Card
                  key={a.addressId}
                  className={`mb-4 ${
                    a.addressId === billingAddressId
                      ? "border-2 border-green-500"
                      : ""
                  }`}
                  onClick={() => {
                    if (shippingCheckbox) {
                      setShippingAddressId(a.addressId);
                    }
                    setBillingAddressId(a.addressId);
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" className="text-gray-800">
                      {a.addressLine1}, {a.addressLine2}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {a.city}, {a.state}, {a.country}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {a.postalCode}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {a.phone}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      className="mt-2"
                      onClick={() => deleteAddressHandler(a.addressId)}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shippingCheckbox}
                    onChange={() => setShippingCheckbox(!shippingCheckbox)}
                  />
                }
                label="Shipping Address is same as Billing Address"
              />
              {!shippingCheckbox && (
                <>
                  <Typography
                    variant="h5"
                    className="font-bold text-gray-800 mt-6 mb-4"
                  >
                    Select Shipping Address
                  </Typography>
                  {addresses.map((a) => (
                    <Card
                      key={a.addressId}
                      className={`mb-4 ${
                        a.addressId === shippingAddressId
                          ? "border-2 border-green-500"
                          : ""
                      }`}
                      onClick={() => setShippingAddressId(a.addressId)}
                    >
                      <CardContent>
                        <Typography variant="body1" className="text-gray-800">
                          {a.addressLine1}, {a.addressLine2}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {a.city}, {a.state}, {a.country}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {a.postalCode}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {a.phone}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}
        </Box>

        {/* Add New Address */}
        <Box>
          {addressSaveError && (
            <Message variant="danger">{JSON.stringify(addressSaveError)}</Message>
          )}
          {message && <Message variant="danger">{message}</Message>}
          <Typography variant="h5" className="font-bold text-gray-800 mb-4">
            Add New Address
          </Typography>
          <form onSubmit={saveAddressHandler}>
            <TextField
              label="Address Line 1"
              fullWidth
              required
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="Address Line 2"
              fullWidth
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="City"
              fullWidth
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="State"
              fullWidth
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mb-4"
            />
            <FormControl fullWidth className="mb-4">
              <InputLabel>Country</InputLabel>
              <Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <MenuItem value="0">Select Country</MenuItem>
                <MenuItem value="US">United States</MenuItem>
                <MenuItem value="CA">Canada</MenuItem>
                {/* Add more countries as needed */}
              </Select>
            </FormControl>
            <TextField
              label="Postal Code"
              fullWidth
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="mb-4"
            />
            <TextField
              label="Phone"
              fullWidth
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mb-4"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={addressSaveLoading}
            >
              {addressSaveLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Add New Address"
              )}
            </Button>
          </form>
        </Box>
      </Box>

      {/* Proceed to Payment */}
      <Box className="mt-8 text-center">
        <Button
          variant="contained"
          color="success"
          onClick={proceedToPayment}
          disabled={!shippingAddressId}
        >
          Proceed to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingScreen;