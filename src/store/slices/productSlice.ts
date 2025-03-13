import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllProductsDetailApi,
  getProductDetailApi,
  getProductReviewsApi,
  createProductReviewApi,
  updateProductDetailApi,
  createProductApi,
  deleteProductApi,
  getImageApi
} from '@/utils/RestApiCalls';
import { getErrorMessage } from '@/utils/CommonUtils';

// Async Thunks
export const listProducts = createAsyncThunk('products/list', async (pageNumber, { rejectWithValue }) => {
  try {
    const allProductsDetail = await getAllProductsDetailApi(pageNumber || 0);
    return { products: allProductsDetail.page.content, pageResponse: allProductsDetail.page };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const listProductDetails = createAsyncThunk('products/details', async (productId, { rejectWithValue }) => {
  try {
    return await getProductDetailApi(productId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const listProductReviews = createAsyncThunk('products/reviews', async (productId, { rejectWithValue }) => {
  try {
    return await getProductReviewsApi(productId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createProductReview = createAsyncThunk('products/createReview', async (reviewData, { rejectWithValue, dispatch }) => {
  try {
    await createProductReviewApi(reviewData);
    dispatch(listProductDetails(reviewData.productId));
    dispatch(listProductReviews(reviewData.productId));
    return;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (productId, { rejectWithValue }) => {
  try {
    await deleteProductApi(productId);
    return;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    return await createProductApi(productData);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateProduct = createAsyncThunk('products/update', async (productData, { rejectWithValue, dispatch }) => {
  try {
    await updateProductDetailApi(productData);
    dispatch(listProductDetails(productData.productId));
    return;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getImage = createAsyncThunk('products/image', async (imageId, { rejectWithValue }) => {
  try {
    return await getImageApi(imageId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: {},
    reviews: {
      loading: false,
      error: null,
      reviews: []
    },
    deleteProduct: {
      loading: false,
      error: null,
      success: false
    },
    listProduct: {
      products: [],
      loading: false,
      error: null,
      success: false
    }, 
    createProduct: {
      products: [],
      loading: false,
      error: null,
      success: false
    },    
    updateProduct: {
      products: [],
      loading: false,
      error: null,
      success: false
    },
    loading: false,
    error: null,
    image: null,
    success: false
  },
  reducers: {
    resetProductState: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pageResponse = action.payload.pageResponse;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(listProductDetails.fulfilled, (state, action) => {
        state.product = action.payload;
      })
      .addCase(listProductReviews.fulfilled, (state, action) => {
        state.reviews.reviews = action.payload;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.success = true;
        state.product = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.success = true;
        state.product = action.payload;
      })
      .addCase(getImage.fulfilled, (state, action) => {
        state.image = action.payload;
      });
  }
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
