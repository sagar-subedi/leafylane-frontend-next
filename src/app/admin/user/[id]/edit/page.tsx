"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { getUserDetails, updateUser } from "@/store/slices/userSlice";
import { USER_UPDATE_RESET } from "@/constants/userConstants";
import { getAllRolesApi } from "@/utils/RestApiCalls";

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Map());

  const userDetails = useSelector((state) => state.user);
  const { loading, error, userInfo } = userDetails;

  const userUpdate = useSelector((state) => state.user.updateUserProfile);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    const fetchData = async () => {
      if (successUpdate) {
        dispatch({ type: USER_UPDATE_RESET });
        router.push("/admin/userlist");
      } else {
        if (!userInfo?.userName || userInfo?.userId !== userId) {
          dispatch(getUserDetails(userId));
        } else {
          setFirstName(userInfo.firstName);
          setLastName(userInfo.lastName);
          setEmail(userInfo.email);
          userInfo.roles.forEach((role) => {
            checkedItems.set(role.roleName, true);
            setCheckedItems(new Map(checkedItems));
          });
        }
      }
      const rolesData = await getAllRolesApi();
      setRoles(rolesData);
    };

    fetchData();
  }, [dispatch, router, userId, userInfo, successUpdate]);

  const handleChange = (event) => {
    checkedItems.set(event.target.name, event.target.checked);
    setCheckedItems(new Map(checkedItems));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("The user id is " + userId)
    const selectedRoles = Array.from(checkedItems)
      .filter((item) => item[1] === true)
      .map((i) => i[0]);

      const userUpdateRequestBody = {
        firstName,
        lastName,
        email,
        roles: selectedRoles,
      };
    dispatch(
      updateUser(userId, userUpdateRequestBody)
    );
  };

  return (
    <Box className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/admin/userlist" className="text-blue-600 hover:underline mb-6 inline-block">
        Go Back
      </Link>
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Edit User
      </Typography>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <form onSubmit={submitHandler}>
          <Box className="mb-4">
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Box>
          <Box className="mb-4">
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Box>
          <Box className="mb-4">
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>

          {/* Roles */}
          {roles.length > 0 &&
            roles.map((role) => (
              <Box key={role.roleName} className="mb-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!checkedItems.get(role.roleName)}
                      name={role.roleName}
                      onChange={handleChange}
                    />
                  }
                  label={`ROLE: ${role.roleName}`}
                />
              </Box>
            ))}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loadingUpdate}
            className="mt-4"
          >
            {loadingUpdate ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default UserEditScreen;