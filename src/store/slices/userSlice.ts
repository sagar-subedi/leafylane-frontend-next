import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserInfoApi,
  postLoginApi,
  postSignupApi,
  putUserInfoApi,
  deleteUserApi,
  getAllUsersApi,
  getUserApi,
  updateUserApi,
} from "@/utils/RestApiCalls";
import { getErrorMessage } from "@/utils/CommonUtils";
import { getFromLocalStorage } from "@/utils/LocalStorageUtils";
import { toast } from "react-toastify";

// const userInfoFromStorage = typeof window !== 'undefined' && getFromLocalStorage('userInfo') 
// ? JSON.parse(getFromLocalStorage('userInfo')!) 
//   : null;

const userInfoFromStorage = typeof window !== 'undefined' && getFromLocalStorage('userInfo')
  ? JSON.parse(getFromLocalStorage('userInfo')!)
  : null;

export const login = createAsyncThunk(
  "user/login",
  async ({ usernameOrEmail, password }: any, { rejectWithValue }) => {
    try {
      const loginResponse = await postLoginApi({
        grant_type: "authorization_code",
        username: usernameOrEmail,
        password,
      });
      const userInfoResponse = await getUserInfoApi();
      userInfoResponse.token = loginResponse.access_token;
      userInfoResponse.refresh_token = loginResponse.refresh_token;
      localStorage.setItem("userInfo", JSON.stringify(userInfoResponse));
      return userInfoResponse;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async ({ userName, firstName, email, password }: any, { rejectWithValue }) => {
    try {
      await postSignupApi({
        grant_type: "authorization_code",
        userName,
        password,
        firstName,
        email,
      });
      // Dispatch the login action after successful registration
      toast.success('Successful Registration. You can now log in with your credentials.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "user/details",
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      return userId ? await getUserApi(userId) : await getUserInfoApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (user: any, { rejectWithValue }) => {
    try {
      await putUserInfoApi(user);
      const userInfoStr = getFromLocalStorage("userInfo");
      const updatedUserInfo = {
        ...(userInfoStr ? JSON.parse(userInfoStr) : {}),
        ...user,
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      return updatedUserInfo;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const listUsers = createAsyncThunk(
  "user/list",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllUsersApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId: string, { rejectWithValue }) => {
    try {
      await deleteUserApi(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userId, userUpdateRequestBody }: any, { rejectWithValue, dispatch }) => {
    try {
      console.log("The user id in update user thunk is " + userId);
      await updateUserApi(userId, userUpdateRequestBody);
      dispatch(getUserDetails(userId));
      dispatch(listUsers());
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: userInfoFromStorage,
    login: {
      loading: false,
      error: null,
    },
    register: {
      loading: false,
      error: null,
    },
    getUserDetails: {
      loading: false,
      error: null,
      user: null,
    },
    updateUserProfile: {
      loading: false,
      error: null,
    },
    listUsers: {
      loading: false,
      error: null,
      users: [],
    },
    deleteUser: {
      loading: false,
      error: null,
    },
    updateUser: {
      loading: false,
      error: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.userInfo = null;
      window.location.href = '/login';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.login.loading = true;
        state.login.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.login.loading = false;
        state.login.error = action.payload as any;
      })
      .addCase(register.pending, (state) => {
        state.register.loading = true;
        state.register.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = action.payload as any;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.getUserDetails.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.getUserDetails.loading = false;
        state.getUserDetails.user = action.payload;
        state.userInfo = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.getUserDetails.loading = false;
        state.getUserDetails.error = action.payload as any;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.listUsers.users = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.deleteUser.loading = false;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.updateUser.loading = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
