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
  Container,
  Grid,
  Paper,
  Divider,
  IconButton
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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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

  const addressList = useSelector((state: any) => state.address.listAddresses);
  const { addresses, loading: addressListLoading, error: addressListError } =
    addressList;

  const addressSave = useSelector((state: any) => state.address.saveAddress);
  const { loading: addressSaveLoading, error: addressSaveError } = addressSave;

  const getShippingAddress = async () => {
    dispatch(getMyAddresses() as any);
  };

  useEffect(() => {
    getShippingAddress();
  }, [dispatch]);

  useEffect(() => {
    if (addresses?.length > 0) {
      // If IDs are not set yet, set them to the first address
      if (!billingAddressId) setBillingAddressId(addresses[0].addressId);
      if (!shippingAddressId) setShippingAddressId(addresses[0].addressId);
    }
  }, [addresses]);

  const saveAddressHandler = async (e: any) => {
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

    await dispatch(saveAddress(addressRequestBody) as any);

    // Clear form
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("");
    setPhone("");

    dispatch(getShippingAddress() as any);
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

  const deleteAddressHandler = (addressId: any) => {
    if (addressId === billingAddressId) {
      setBillingAddressId("");
    }
    if (addressId === shippingAddressId) {
      setShippingAddressId("");
    }
    dispatch(deleteAddress(addressId) as any);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <CheckoutSteps step1 step2 />

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
              <HomeIcon sx={{ color: 'var(--color-primary)', mr: 1.5, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                Select Address
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {addressListLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: 'var(--color-primary)' }} />
              </Box>
            ) : (
              <>
                {addressListError && (
                  <Message variant="danger">
                    {JSON.stringify(addressListError)}
                  </Message>
                )}

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'var(--color-text-primary)' }}>
                  Billing Address
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 4 }}>
                  {addresses?.map((a: any) => (
                    <Card
                      key={a.addressId}
                      sx={{
                        cursor: 'pointer',
                        border: a.addressId === billingAddressId ? '2px solid var(--color-primary)' : '1px solid var(--color-border-main)',
                        backgroundColor: a.addressId === billingAddressId ? 'rgba(45, 106, 79, 0.05)' : 'white',
                        transition: 'all 0.2s',
                        position: 'relative',
                        '&:hover': {
                          borderColor: 'var(--color-primary)',
                          transform: 'translateY(-2px)',
                          boxShadow: 'var(--shadow-sm)'
                        }
                      }}
                      onClick={() => {
                        if (shippingCheckbox) {
                          setShippingAddressId(a.addressId);
                        }
                        setBillingAddressId(a.addressId);
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {a.city}, {a.country}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {a.addressLine1} {a.addressLine2 && `, ${a.addressLine2}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {a.state}, {a.postalCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {a.phone}
                        </Typography>

                        <IconButton
                          size="small"
                          color="error"
                          sx={{ position: 'absolute', top: 5, right: 5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddressHandler(a.addressId);
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={shippingCheckbox}
                      onChange={() => setShippingCheckbox(!shippingCheckbox)}
                      sx={{
                        color: 'var(--color-primary)',
                        '&.Mui-checked': {
                          color: 'var(--color-primary)',
                        },
                      }}
                    />
                  }
                  label="Shipping Address is same as Billing Address"
                  sx={{ mb: 3 }}
                />

                {!shippingCheckbox && (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 2, color: 'var(--color-text-primary)' }}>
                      Shipping Address
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      {addresses?.map((a: any) => (
                        <Card
                          key={a.addressId}
                          sx={{
                            cursor: 'pointer',
                            border: a.addressId === shippingAddressId ? '2px solid var(--color-primary)' : '1px solid var(--color-border-main)',
                            backgroundColor: a.addressId === shippingAddressId ? 'rgba(45, 106, 79, 0.05)' : 'white',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: 'var(--color-primary)',
                            }
                          }}
                          onClick={() => setShippingAddressId(a.addressId)}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {a.city}, {a.country}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {a.addressLine1}, {a.postalCode}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </>
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
              <AddLocationIcon sx={{ color: 'var(--color-primary)', mr: 1.5, fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                Add New Address
              </Typography>
            </Box>
            <Divider sx={{ mb: 4 }} />

            {addressSaveError && (
              <Message variant="danger">{JSON.stringify(addressSaveError)}</Message>
            )}
            {message && <Message variant="danger">{message}</Message>}

            <form onSubmit={saveAddressHandler}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Address Line 1"
                    fullWidth
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address Line 2"
                    fullWidth
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="City"
                    fullWidth
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="State"
                    fullWidth
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      label="Country"
                    >
                      <MenuItem value=""><em>Select Country</em></MenuItem>
                      <MenuItem value="US">United States</MenuItem>
                      <MenuItem value="CA">Canada</MenuItem>
                      <MenuItem value="NP">Nepal</MenuItem>
                      <MenuItem value="AU">Australia</MenuItem>
                      <MenuItem value="UK">United Kingdom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Postal Code"
                    fullWidth
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={addressSaveLoading}
                    sx={{
                      mt: 2,
                      bgcolor: 'var(--color-primary)',
                      '&:hover': { bgcolor: 'var(--color-primary-dark)' },
                      py: 1.5
                    }}
                  >
                    {addressSaveLoading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      "Save Address"
                    )}
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
              onClick={proceedToPayment}
              disabled={!shippingAddressId}
              startIcon={<LocalShippingIcon />}
              sx={{
                bgcolor: 'var(--color-accent)',
                '&:hover': { bgcolor: '#40916C' },
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              Proceed to Payment
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShippingScreen;