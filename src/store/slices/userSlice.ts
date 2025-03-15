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

// const userInfoFromStorage = typeof window !== 'undefined' && getFromLocalStorage('userInfo') 
// ? JSON.parse(getFromLocalStorage('userInfo')!) 
//   : null;

const userInfoFromStorage = typeof window !== 'undefined' && getFromLocalStorage('userInfo') 
? JSON.parse(getFromLocalStorage('userInfo')!) 
  : null;

export const login = createAsyncThunk(
  "user/login",
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const loginResponse = await postLoginApi({
        grant_type: "password",
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
  async ({ userName, firstName, email, password }, { rejectWithValue }) => {
    try {
      await postSignupApi({
        grant_type: "password",
        userName,
        password,
        firstName,
        email,
      });
      return await login({ usernameOrEmail: userName, password });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "user/details",
  async (userId, { rejectWithValue }) => {
    try {
      return userId ? await getUserApi(userId) : await getUserInfoApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (user, { rejectWithValue }) => {
    try {
      await putUserInfoApi(user);
      const updatedUserInfo = {
        ...JSON.parse(getFromLocalStorage("userInfo")),
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
  async (userId, { rejectWithValue }) => {
    try {
      await deleteUserApi(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userId, userUpdateRequestBody }, { rejectWithValue, dispatch }) => {
    try {
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
        state.login.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.register.loading = true;
        state.register.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.register.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.register.loading = false;
        state.register.error = action.payload;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.getUserDetails.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.getUserDetails.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.getUserDetails.loading = false;
        state.getUserDetails.error = action.payload;
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
