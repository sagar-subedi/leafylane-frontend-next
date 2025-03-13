import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/utils/CommonUtils';
import { getAllPaymentMethodsApi, savePaymentMethodApi } from '@/utils/RestApiCalls';

// Async actions
export const savePaymentMethod = createAsyncThunk(
  'payment/savePaymentMethod',
  async (cardRequestBody, { rejectWithValue }) => {
    try {
      await savePaymentMethodApi(cardRequestBody);
      return {}; // Success response (no payload needed)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'payment/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const paymentMethodsList = await getAllPaymentMethodsApi();
      return paymentMethodsList;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Redux slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    savePayment: {
      loading: false,
      error: null,
      success: false
    },
    listPaymentMethods:{
      paymentMethods: [],
      loading: false,
      error: null,
      success: false
    }
  },
  reducers: {
    resetPaymentState: (state) => {
      state.listPaymentMethods.success = false;
      state.listPaymentMethods.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Save Payment Method
      .addCase(savePaymentMethod.pending, (state) => {
        state.savePayment.loading = true;
        state.savePayment.success = false;
        state.savePayment.error = null;
      })
      .addCase(savePaymentMethod.fulfilled, (state) => {
        state.savePayment.loading = false;
        state.savePayment.success = true;
      })
      .addCase(savePaymentMethod.rejected, (state, action) => {
        state.savePayment.loading = false;
        state.savePayment.error = action.payload;
      })
      // Fetch Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.listPaymentMethods.loading = true;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.listPaymentMethods.loading = false;
        state.listPaymentMethods.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.listPaymentMethods.loading = false;
        state.listPaymentMethods.error = action.payload;
      });
  }
});

// Export actions & reducer
export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
