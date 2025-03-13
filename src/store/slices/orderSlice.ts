import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAllMyOrdersApi, 
  previewOrderApi, 
  placeOrderApi, 
  getOrderApi, 
  getAllOrdersApi 
} from '@/utils/RestApiCalls';
import { getErrorMessage } from '@/utils/CommonUtils';
import { getFromLocalStorage } from '@/utils/LocalStorageUtils';

const billingAddressId = typeof window !== 'undefined' && getFromLocalStorage('billingAddressId') 
  ? getFromLocalStorage('billingAddressId') 
  : null;
const shippingAddressId = typeof window !== 'undefined' && getFromLocalStorage('shippingAddressId') 
  ? getFromLocalStorage('shippingAddressId') 
  : null;
const paymentMethodId = typeof window !== 'undefined' && getFromLocalStorage('paymentMethodId') 
  ? getFromLocalStorage('paymentMethodId') 
  : null;


export const listOrdersAdmin = createAsyncThunk('orders/listAdmin', async (_, { rejectWithValue }) => {
  try {
    return await getAllOrdersApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const listMyOrdersAction = createAsyncThunk('orders/listMy', async (_, { rejectWithValue }) => {
  try {
    return await getAllMyOrdersApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const previewOrderAction = createAsyncThunk('orders/preview', async (requestBody, { rejectWithValue }) => {
  try {
    return await previewOrderApi(requestBody);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const placeOrderAction = createAsyncThunk('orders/create', async (requestBody, { rejectWithValue }) => {
  try {
    return await placeOrderApi(requestBody);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getOrderDetailsAction = createAsyncThunk('orders/details', async (orderId, { rejectWithValue }) => {
  try {
    return await getOrderApi(orderId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    billingAddressId,
    shippingAddressId,
    paymentMethodId,
    listOrders: { orders: [], loading: false, error: null },
    listMyOrders: { orders: [], loading: false, error: null },
    previewOrder: { order: {}, loading: false, error: null },
    createOrder: { order: {}, loading: false, error: null },
    orderDetails: { order: {}, loading: true, error: null },
  },
  reducers: {
    saveBillingAddressId: (state, action) => {
      state.billingAddressId = action.payload;
      localStorage.setItem('billingAddressId', action.payload);
    },
    saveShippingAddressId: (state, action) => {
      state.shippingAddressId = action.payload;
      localStorage.setItem('shippingAddressId', action.payload);
    },
    savePaymentMethodId: (state, action) => {
      state.paymentMethodId = action.payload;
      localStorage.setItem('paymentMethodId', action.payload);
    },
    resetListOrders: (state) => {
      state.listOrders = { orders: [], loading: false, error: null };
    },
    resetListMyOrders: (state) => {
      state.listMyOrders = { orders: [], loading: false, error: null };
    },
    resetPreviewOrder: (state) => {
      state.previewOrder = { order: {}, loading: false, error: null };
    },
    resetCreateOrder: (state) => {
      state.createOrder = { order: {}, loading: false, error: null };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(listOrdersAdmin.pending, (state) => {
        state.listOrders.loading = true;
      })
      .addCase(listOrdersAdmin.fulfilled, (state, action) => {
        state.listOrders = { orders: action.payload, loading: false, error: null };
      })
      .addCase(listOrdersAdmin.rejected, (state, action) => {
        state.listOrders = { orders: [], loading: false, error: action.payload };
      })
      .addCase(listMyOrdersAction.pending, (state) => {
        state.listMyOrders.loading = true;
      })
      .addCase(listMyOrdersAction.fulfilled, (state, action) => {
        state.listMyOrders = { orders: action.payload, loading: false, error: null };
      })
      .addCase(listMyOrdersAction.rejected, (state, action) => {
        state.listMyOrders = { orders: [], loading: false, error: action.payload };
      })
      .addCase(previewOrderAction.pending, (state) => {
        state.previewOrder.loading = true;
      })
      .addCase(previewOrderAction.fulfilled, (state, action) => {
        state.previewOrder = { order: action.payload, loading: false, error: null };
      })
      .addCase(previewOrderAction.rejected, (state, action) => {
        state.previewOrder = { order: {}, loading: false, error: action.payload };
      })
      .addCase(placeOrderAction.pending, (state) => {
        state.createOrder.loading = true;
      })
      .addCase(placeOrderAction.fulfilled, (state, action) => {
        state.createOrder = { order: action.payload, loading: false, error: null };
      })
      .addCase(placeOrderAction.rejected, (state, action) => {
        state.createOrder = { order: {}, loading: false, error: action.payload };
      })
      .addCase(getOrderDetailsAction.pending, (state) => {
        state.orderDetails.loading = true;
      })
      .addCase(getOrderDetailsAction.fulfilled, (state, action) => {
        state.orderDetails = { order: action.payload, loading: false, error: null };
      })
      .addCase(getOrderDetailsAction.rejected, (state, action) => {
        state.orderDetails = { order: {}, loading: false, error: action.payload };
      });
  }
});

export const {
  saveBillingAddressId,
  saveShippingAddressId,
  savePaymentMethodId,
  resetListOrders,
  resetListMyOrders,
  resetPreviewOrder,
  resetCreateOrder
} = orderSlice.actions;

export default orderSlice.reducer;
