"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { listProductDetails, updateProduct } from "@/store/slices/productSlice";
import Loader from "@/components/Loader";
import Message from "@/components/Message";
import { PRODUCT_UPDATE_RESET } from "@/constants/productConstants";
import { uploadImageApi } from "@/utils/RestApiCalls";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [availableItemCount, setAvailableItemCount] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { loading, error, product } = useSelector((state) => state.product);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector(
    (state) => state.product.updateProduct
  );

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      router.push("/admin/productlist");
    } else if (!product?.productName || product?.productId !== productId) {
      dispatch(listProductDetails(productId));
    } else {
      setProductName(product.productName);
      setPrice(product.price);
      setImage(product.imageId);
      setAvailableItemCount(product.availableItemCount);
      setDescription(product.description);
    }
  }, [dispatch, router, productId, product, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imageFile", file);
    setUploading(true);

    try {
      const { imageId } = await uploadImageApi({}, formData);
      setImage(imageId);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = () => {
    dispatch(
      updateProduct({
        productId,
        productName,
        price,
        imageId: image,
        description,
        availableItemCount,
      })
    );
  };

  return (
    <Box className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/admin/productlist" className="text-blue-600 hover:underline mb-6 inline-block">
        Go Back
      </Link>
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Edit Product
      </Typography>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Grid container spacing={4}>
          {/* Image Upload Section */}
          <Grid item xs={12} md={4}>
            {image && (
              <Image
                src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${image}`}
                alt="Product Image"
                width={400}
                height={400}
                style={{ objectFit: "contain" }}
              />
            )}
            {uploading && <Loader />}
            <Button variant="contained" component="label" className="mt-4">
              Upload Image
              <input type="file" hidden onChange={uploadFileHandler} />
            </Button>
          </Grid>

          {/* Product Details Section */}
          <Grid item xs={12} md={8}>
            <Box className="mb-4">
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Box>
            <Box className="mb-4">
              <TextField
                label="Price"
                type="number"
                variant="outlined"
                fullWidth
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </Box>
            <Box className="mb-4">
              <TextField
                label="Count In Stock"
                type="number"
                variant="outlined"
                fullWidth
                required
                value={availableItemCount}
                onChange={(e) => setAvailableItemCount(Number(e.target.value))}
              />
            </Box>
            <Box className="mb-4">
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={submitHandler}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProductEditScreen;