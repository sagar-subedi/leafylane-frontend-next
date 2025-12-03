"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import FullPageLoader from "@/components/FullPageLoader";
import Loader from "@/components/Loader";
import Message from "@/components/Message";
import Rating from "@/components/Rating";
import { getImageApi, getProductDetailApi } from "@/utils/RestApiCalls";
import { createProductReview, listProductReviews } from "@/store/slices/productSlice";
import { addToCart } from "@/store/slices/cartSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Chip,
  Divider,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductScreen = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [productimageBase64, setProductimageBase64] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const productDetails = useSelector((state: any) => state.product);
  const { loading, error } = productDetails;

  const productReviews = useSelector((state: any) => state.product.reviews);
  const { loading: loadingProductReviews, error: errorProductReviews, reviews } = productReviews;

  const userLogin = useSelector((state: any) => state.user);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state: any) => state.product);
  const { success: successProductReview, loading: loadingProductReview, error: errorProductReview } = productReviewCreate;

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const productData = await getProductDetailApi(id);
        setProduct(productData);
        dispatch(listProductReviews(id) as any);

        if (productData?.imageId) {
          const imageBase64 = await getImageApi(productData.imageId);
          setProductimageBase64(imageBase64);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [dispatch, id]);

  const addToCartHandler = async () => {
    await dispatch(addToCart({ productId: id, quantity: qty }) as any);
    router.push("/cart");
  };

  const createProductReviewHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createProductReview({
        productId: id,
        ratingValue: rating,
        reviewMessage: reviewMessage,
      }) as any
    );
  };

  const isInStock = product?.availableItemCount > 0;
  const isLowStock = product?.availableItemCount > 0 && product?.availableItemCount < 5;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 4,
          color: 'var(--color-primary)',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'rgba(45, 106, 79, 0.08)',
          },
        }}
      >
        Back to Products
      </Button>

      {error ? (
        <Message variant="danger">An Error Occurred</Message>
      ) : product ? (
        <>
          {/* Product Info and Add to Cart Section */}
          <Grid container spacing={4} className="animate-fadeIn">
            {/* Left Column - Product Image and Info */}
            <Grid item xs={12} md={9}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid var(--color-border-light)',
                }}
              >
                {/* Product Image */}
                <Box sx={{ mb: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid var(--color-border-light)',
                      position: 'relative',
                      height: { xs: 300, sm: 400, md: 450 },
                      backgroundColor: 'var(--color-bg-subtle)',
                    }}
                  >
                    {product?.imageId && (
                      <img
                        src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product.imageId}`}
                        alt={product.productName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onLoad={() => setImageLoaded(true)}
                      />
                    )}
                    {!imageLoaded && (
                      <Box
                        className="skeleton"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    )}
                  </Paper>
                </Box>

                {/* Product Name */}
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    mb: 2,
                    fontSize: { xs: '1.75rem', md: '2.5rem' },
                  }}
                >
                  {product.productName}
                </Typography>

                {/* Rating */}
                <Box sx={{ mb: 3 }}>
                  <Rating value={product.averageRating} text={`${product.noOfRatings} reviews`} />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Price */}
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    mb: 3,
                  }}
                >
                  ${product.price}
                </Typography>

                {/* Stock Status */}
                <Box sx={{ mb: 3 }}>
                  {isInStock ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={isLowStock ? `Only ${product.availableItemCount} left!` : "In Stock"}
                      color={isLowStock ? "warning" : "success"}
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        py: 2.5,
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label="Out of Stock"
                      color="error"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        py: 2.5,
                      }}
                    />
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.8,
                  }}
                >
                  {product.description}
                </Typography>
              </Paper>
            </Grid>

            {/* Right Column - Add to Cart */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '1px solid var(--color-border-light)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  position: { md: 'sticky' },
                  top: { md: 100 },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Purchase Options
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* Price Display */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 1 }}>
                    Price
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}
                  >
                    ${product.price}
                  </Typography>
                </Box>

                {/* Status */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 1 }}>
                    Availability
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: isInStock ? 'var(--color-accent-success)' : 'var(--color-accent-warning)',
                    }}
                  >
                    {isInStock ? (isLowStock ? `Only ${product.availableItemCount} left` : 'In Stock') : 'Out of Stock'}
                  </Typography>
                </Box>

                {isInStock && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Quantity</InputLabel>
                    <Select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      label="Quantity"
                    >
                      {[...Array(Math.min(10, product.availableItemCount)).keys()].map((x) => (
                        <MenuItem key={x + 1} value={x + 1}>
                          {x + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCartIcon />}
                  onClick={addToCartHandler}
                  disabled={!isInStock}
                  sx={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1.1rem',
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
                  {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Tabs Section - Reviews */}
          <Box sx={{ mt: 6 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid var(--color-border-light)',
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  borderBottom: '1px solid var(--color-border-light)',
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    color: 'var(--color-text-muted)',
                    '&.Mui-selected': {
                      color: 'var(--color-primary)',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'var(--color-primary)',
                    height: 3,
                  },
                }}
              >
                <Tab label={`Reviews (${reviews?.length || 0})`} />
                <Tab label="Write a Review" />
              </Tabs>

              {/* Reviews Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ px: 3 }}>
                  {reviews?.length === 0 && (
                    <Typography sx={{ color: 'var(--color-text-muted)', textAlign: 'center', py: 4 }}>
                      No reviews yet. Be the first to review this product!
                    </Typography>
                  )}
                  {reviews?.map((review: any) => (
                    <Card
                      key={review.reviewId}
                      elevation={0}
                      sx={{
                        mb: 3,
                        p: 3,
                        border: '1px solid var(--color-border-light)',
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                          mb: 1,
                        }}
                      >
                        {review.userName}
                      </Typography>
                      <Rating value={review.ratingValue} />
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 2,
                          color: 'var(--color-text-muted)',
                          lineHeight: 1.7,
                        }}
                      >
                        {review.reviewMessage}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              </TabPanel>

              {/* Write Review Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ px: 3, maxWidth: 600 }}>
                  {successProductReview && (
                    <Message variant="success">Review submitted successfully!</Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}

                  {userInfo ? (
                    <form onSubmit={createProductReviewHandler}>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Rating</InputLabel>
                        <Select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          label="Rating"
                        >
                          <MenuItem value="">Select...</MenuItem>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <MenuItem key={value} value={value}>
                              {value} - {["Poor", "Fair", "Good", "Very Good", "Excellent"][value - 1]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Your Review"
                        multiline
                        rows={4}
                        fullWidth
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        sx={{ mb: 3 }}
                      />
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        disabled={loadingProductReview}
                        sx={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'var(--color-primary-dark)',
                          },
                        }}
                      >
                        Submit Review
                      </Button>
                    </form>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Please{" "}
                        <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                          sign in
                        </Link>{" "}
                        to write a review
                      </Typography>
                    </Box>
                  )}
                </Box>
              </TabPanel>
            </Paper>
          </Box>
        </>
      ) : null}

      {loading && <FullPageLoader />}
    </Container>
  );
};

export default ProductScreen;