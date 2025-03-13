import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '@/store/slices/profileSlice'
import userReducer from '@/store/slices/userSlice'
import orderReducer from '@/store/slices/orderSlice'
import paymentReducer from '@/store/slices/paymentSlice'
import productReducer from '@/store/slices/productSlice'
import cartReducer from '@/store/slices/cartSlice'
import addressReducer, { deleteAddress, getMyAddresses, saveAddress } from  '@/store/slices/addressSlice'
import { getFromLocalStorage } from '@/utils/LocalStorageUtils';
// Local storage defaults
const userInfoFromStorage = typeof window !== 'undefined' && getFromLocalStorage('userInfo') 
  ? JSON.parse(getFromLocalStorage('userInfo')!) 
  : null;

// Initial state
const initialState = {

};

export const store =  configureStore({
  reducer: {
    profile: profileReducer,
    address: addressReducer,
    product: productReducer,
    payment: paymentReducer,
    user: userReducer,
    order: orderReducer,
    cart: cartReducer,
  },
  preloadedState: initialState,
  devTools: true
//   devTools: process.env.NODE_ENV !== 'production'
});

// TypeScript types for `RootState` and `AppDispatch`
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;