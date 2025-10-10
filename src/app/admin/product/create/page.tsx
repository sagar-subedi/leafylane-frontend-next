"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { createProduct } from "@/store/slices/productSlice";
import Loader from "@/components/Loader";
import Message from "@/components/Message";
import { uploadImageApi, getProductCategories } from "@/utils/RestApiCalls";

const ProductCreateScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [availableItemCount, setAvailableItemCount] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [productCategory, setProductCategory] = useState("");

  const productDetails = useSelector((state) => state.product);
  const { loading, error } = productDetails;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getProductCategories();
        setProductCategories(res.page.content);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

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
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        productName,
        price,
        imageId: image,
        description,
        availableItemCount,
        productCategoryId: productCategory,
      })
    );
    router.push("/admin/productlist");
  };

  return (
    <Box className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/admin/productlist" className="text-blue-600 hover:underline mb-6 inline-block">
        Go Back
      </Link>
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Create Product
      </Typography>
      <hr className="mb-6" />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <form onSubmit={submitHandler}>
          <Grid container spacing={4}>
            {/* Image Upload Section */}
            <Grid item xs={12} md={4}>
              {image && (
                <img
                  src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${image}`}
                  alt="Product"
                  className="rounded-md object-cover w-full h-64"
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
              <Box className="mb-4">
                <Typography variant="body1" className="mb-2">
                  Product Category
                </Typography>
                <Select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  fullWidth
                  required
                >
                  <MenuItem value="">Select Product Category</MenuItem>
                  {productCategories.map((pc) => (
                    <MenuItem key={pc.productCategoryId} value={pc.productCategoryId}>
                      {pc.productCategoryName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Product
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
};

export default ProductCreateScreen;