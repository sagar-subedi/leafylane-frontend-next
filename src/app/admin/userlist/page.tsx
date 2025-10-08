"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { isAdmin } from "@/utils/CommonUtils";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { listUsers, deleteUser } from "@/store/slices/userSlice";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const userList = useSelector((state) => state.user.listUsers);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.user.deleteUser);
  const { success: successDelete, error: userDeleteError } = userDelete;

  useEffect(() => {
    if (userInfo && isAdmin()) {
      dispatch(listUsers());
    } else {
      router.push("/login");
    }
  }, [dispatch, router, successDelete, userInfo]);

  const deleteHandler = (userId) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Users
      </Typography>

      {userDeleteError && <Message variant="danger">{userDeleteError}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>USERNAME</TableCell>
                <TableCell>FIRST NAME</TableCell>
                <TableCell>LAST NAME</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>ROLES</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    {user.roles.map((role) => (
                      <Typography
                        key={role.roleName}
                        className={`m-0 p-0 ${role.roleName === "ROLE_ADMIN" ? "text-green-600" : "text-black"}`}
                      >
                        <strong>{role.roleName}</strong>
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Box className="flex gap-2">
                      <Link href={`/admin/user/${user.userId}/edit`} passHref>
                        <Button variant="outlined" size="small" color="primary">
                          <i className="fas fa-edit">Edit</i>
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => deleteHandler(user.userId)}
                      >
                        <i className="fas fa-trash">Delete</i>
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserListScreen;