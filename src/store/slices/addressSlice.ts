import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getErrorMessage } from '@/utils/CommonUtils';
import { getAllAddressesApi, saveAddressApi, deleteAddressApi } from '@/utils/RestApiCalls';

// Async Thunks for API calls
export const saveAddress = createAsyncThunk(
  'address/saveAddress',
  async (addressRequestBody, { rejectWithValue }) => {
    try {
      await saveAddressApi(addressRequestBody);
      return; // No payload needed for success
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getMyAddresses = createAsyncThunk(
  'address/getMyAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const myAddressData = await getAllAddressesApi();
      return myAddressData;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await deleteAddressApi(addressId);
      return addressId; // Return the deleted address ID
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Initial state
const initialState = {
  saveAddress: {
    loading: false,
    success: false,
    error: null,
  },
  listAddresses: {
    loading: false,
    addresses: [],
    error: null,
  },
  deleteAddress: {
    loading: false,
    success: false,
    error: null,
  },
};

// Create the slice
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    resetSaveAddress(state) {
      state.saveAddress = initialState.saveAddress;
    },
    resetListAddresses(state) {
      state.listAddresses = initialState.listAddresses;
    },
    resetDeleteAddress(state) {
      state.deleteAddress = initialState.deleteAddress;
    },
  },
  extraReducers: (builder) => {
    // Save Address
    builder.addCase(saveAddress.pending, (state) => {
      state.saveAddress.loading = true;
      state.saveAddress.success = false;
      state.saveAddress.error = null;
    });
    builder.addCase(saveAddress.fulfilled, (state) => {
      state.saveAddress.loading = false;
      state.saveAddress.success = true;
    });
    builder.addCase(saveAddress.rejected, (state, action) => {
      state.saveAddress.loading = false;
      state.saveAddress.error = action.payload;
    });

    // Get My Addresses
    builder.addCase(getMyAddresses.pending, (state) => {
      state.listAddresses.loading = true;
      state.listAddresses.error = null;
    });
    builder.addCase(getMyAddresses.fulfilled, (state, action) => {
      state.listAddresses.loading = false;
      state.listAddresses.addresses = action.payload;
    });
    builder.addCase(getMyAddresses.rejected, (state, action) => {
      state.listAddresses.loading = false;
      state.listAddresses.error = action.payload;
    });

    // Delete Address
    builder.addCase(deleteAddress.pending, (state) => {
      state.deleteAddress.loading = true;
      state.deleteAddress.success = false;
      state.deleteAddress.error = null;
    });
    builder.addCase(deleteAddress.fulfilled, (state) => {
      state.deleteAddress.loading = false;
      state.deleteAddress.success = true;
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.deleteAddress.loading = false;
      state.deleteAddress.error = action.payload;
    });
  },
});

// Export actions
export const { resetSaveAddress, resetListAddresses, resetDeleteAddress } = addressSlice.actions;

// Export reducer
export default addressSlice.reducer;