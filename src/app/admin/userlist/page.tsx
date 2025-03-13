"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, Button } from "react-bootstrap";
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
    if (window.confirm("Are you sure")) {
      dispatch(deleteUser(userId));
    }
  };

  return (
    <>
      <h1>Users</h1>
      {userDeleteError && <Message variant="danger">{userDeleteError}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USERNAME</th>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>EMAIL</th>
              <th>ROLES</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.userName}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.roles.map((role) => (
                    <p
                      key={role.roleName}
                      className="m-0 p-0"
                      style={{ color: role.roleName === "ROLE_ADMIN" ? "green" : "black" }}
                    >
                      <strong>{role.roleName}</strong>
                    </p>
                  ))}
                </td>
                <td>
                  <Link href={`/admin/user/${user.userId}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </Link>
                  <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user.userId)}>
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
