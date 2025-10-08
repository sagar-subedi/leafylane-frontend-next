"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
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
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const ProductScreen = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [productimageBase64, setProductimageBase64] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);

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
        dispatch(listProductReviews(id));

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
    await dispatch(addToCart({ productId: id, quantity: qty }));
    router.push("/cart");
  };

  const createProductReviewHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createProductReview({
        productId: id,
        ratingValue: rating,
        reviewMessage: reviewMessage,
      })
    );
  };

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" passHref>
        <Button variant="contained" color="success" className="mb-6">
          Go Back
        </Button>
      </Link>

      {error ? (
        <Message variant="danger">An Error Occurred</Message>
      ) : product ? (
        <>
          {/* First Row: Product Image, Description, Add to Cart */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            <div className="flex-1">
              {productimageBase64 && (
                <img
                  src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product?.imageId}`}
                  alt={product.productName}
                  className="rounded-lg shadow-md w-full h-[450px] object-cover object-center"
                />
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <Card className="shadow-md">
                <CardContent>
                  <Typography variant="h4" className="font-bold text-gray-800 mb-4">
                    {product.productName}
                  </Typography>
                  <Rating value={product.averageRating} text={`${product.noOfRatings} reviews`} />
                  <Typography variant="h6" className="mt-4 text-gray-700">
                    Price: <strong>${product.price}</strong>
                  </Typography>
                  <Typography variant="body1" className="mt-2 text-gray-600">
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </div>

            {/* Add to Cart Section */}
            <div className="flex-1">
              <Card className="shadow-md">
                <CardContent>
                  <Typography variant="h6" className="mb-4">
                    Price: <strong>${product.price}</strong>
                  </Typography>
                  <Typography variant="body1" className="mb-4">
                    Status: {product.availableItemCount > 0 ? "In Stock" : "Out of Stock"}
                  </Typography>
                  {product.availableItemCount > 0 && (
                    <FormControl fullWidth className="mb-4">
                      <InputLabel>Quantity</InputLabel>
                      <Select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
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
                    color="success"
                    fullWidth
                    onClick={addToCartHandler}
                    disabled={product.availableItemCount <= 0}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Second Row: Reviews and Add Review */}
          <div className="flex flex-col md:flex-row gap-6 mt-12">
            {/* Reviews Section */}
            <div className="flex-1">
              <Typography variant="h5" className="mb-4 font-bold text-gray-800">
                Reviews
              </Typography>
              {reviews?.length === 0 && <Message>No Reviews</Message>}
              {reviews?.map((review) => (
                <Card key={review.reviewId} className="mb-4 shadow-md">
                  <CardContent>
                    <Typography variant="h6" className="font-bold">
                      {review.userName}
                    </Typography>
                    <Rating value={review.ratingValue} />
                    <Typography variant="body1" className="mt-2">
                      {review.reviewMessage}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Review Section */}
            <div className="flex-1">
              <Card className="shadow-md">
                <CardContent>
                  <Typography variant="h5" className="mb-4 font-bold text-gray-800">
                    Write a Customer Review
                  </Typography>
                  {successProductReview && <Message variant="success">Review submitted successfully</Message>}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && <Message variant="danger">{errorProductReview}</Message>}

                  {userInfo ? (
                    <form onSubmit={createProductReviewHandler}>
                      <FormControl fullWidth className="mb-4">
                        <InputLabel className="mb-2">Rating</InputLabel>
                        <Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                          <MenuItem value="">Select...</MenuItem>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <MenuItem key={value} value={value}>
                              {value} - {["Poor", "Fair", "Good", "Very Good", "Excellent"][value - 1]}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        label="Review"
                        multiline
                        rows={3}
                        fullWidth
                        value={reviewMessage}
                        onChange={(e) => setReviewMessage(e.target.value)}
                        className="mb-4"
                      />
                      <Button variant="contained" color="success" type="submit" fullWidth disabled={loadingProductReview}>
                        Submit
                      </Button>
                    </form>
                  ) : (
                    <Message>
                      Please <Link href="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}

      {loading && <FullPageLoader />}
    </Box>
  );
};

export default ProductScreen;