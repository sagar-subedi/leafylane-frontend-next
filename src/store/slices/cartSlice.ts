import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/utils/CommonUtils';
import { addToCartApi, getCartDetailsApi, removeCartItemApi } from '@/utils/RestApiCalls';
import { setToLocalStorage } from '@/utils/LocalStorageUtils';

// Async Thunks for API calls
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (addToCartRequestBody, { rejectWithValue }) => {
    try {
      await addToCartApi(addToCartRequestBody);
      return; // No payload needed for success
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getCartDetails = createAsyncThunk(
  'cart/getCartDetails',
  async (_, { rejectWithValue }) => {
    try {
      const cartResponse = await getCartDetailsApi();
      return cartResponse;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      await removeCartItemApi(cartItemId);
      return cartItemId; // Return the removed cart item ID
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Initial state
const initialState = {
  cart: {
    loading: false,
    data: {},
    error: null,
  },
  addToCart: {
    loading: false,
    success: false,
    error: null,
  },
  removeFromCart: {
    loading: false,
    success: false,
    error: null,
  },
  // shippingAddress: JSON.parse(getFromLocalStorage('shippingAddress')) || {},
  // paymentMethod: JSON.parse(getFromLocalStorage('paymentMethod')) || '',
  shippingAddress: {},
  paymentMethod: ''
};

// Create the slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
      setToLocalStorage('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    resetAddToCart(state) {
      state.addToCart = initialState.addToCart;
    },
    resetRemoveFromCart(state) {
      state.removeFromCart = initialState.removeFromCart;
    },
    resetCartDetails(state) {
      state.cart = initialState.cart;
    },
    clearCart(state) {
      state.cart.data = {};
      state.shippingAddress = {};
      state.paymentMethod = '';
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
    },
  },
  extraReducers: (builder) => {
    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.addToCart.loading = true;
      state.addToCart.success = false;
      state.addToCart.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state) => {
      state.addToCart.loading = false;
      state.addToCart.success = true;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.addToCart.loading = false;
      state.addToCart.error = action.payload;
    });

    // Get Cart Details
    builder.addCase(getCartDetails.pending, (state) => {
      state.cart.loading = true;
      state.cart.error = null;
    });
    builder.addCase(getCartDetails.fulfilled, (state, action) => {
      state.cart.loading = false;
      state.cart.data = action.payload;
    });
    builder.addCase(getCartDetails.rejected, (state, action) => {
      state.cart.loading = false;
      state.cart.error = action.payload;
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.removeFromCart.loading = true;
      state.removeFromCart.success = false;
      state.removeFromCart.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state) => {
      state.removeFromCart.loading = false;
      state.removeFromCart.success = true;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.removeFromCart.loading = false;
      state.removeFromCart.error = action.payload;
    });
  },
});

// Export actions
export const {
  saveShippingAddress,
  savePaymentMethod,
  resetAddToCart,
  resetRemoveFromCart,
  resetCartDetails,
  clearCart,
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;