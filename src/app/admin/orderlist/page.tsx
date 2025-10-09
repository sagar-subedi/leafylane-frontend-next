"use client";

import React, { useEffect } from "react";
import {
  Box,
  Button,
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
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { listOrdersAdmin } from "@/store/slices/orderSlice";
import Link from "next/link";

const OrderListScreen = () => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.order.listOrders);
  const { loading, error, orders } = orderList;

  useEffect(() => {
    dispatch(listOrdersAdmin());
  }, [dispatch]);

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
        Orders
      </Typography>

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
                <TableCell>DATE</TableCell>
                <TableCell>TOTAL</TableCell>
                <TableCell>PAID</TableCell>
                <TableCell>DELIVERED</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order?.orderId}>
                  <TableCell>{order?.orderId}</TableCell>
                  <TableCell>{order?.created_at?.substring(0, 10)}</TableCell>
                  <TableCell>${order?.totalPrice}</TableCell>
                  <TableCell>
                    {order?.paid ? (
                      order?.paymentDate?.substring(0, 10)
                    ) : (
                      <i className="fas fa-times text-red-500">Pending</i>
                    )}
                  </TableCell>
                  <TableCell>
                    {order?.delivered ? (
                      order?.deliveredDate?.substring(0, 10)
                    ) : (
                      <i className="fas fa-times text-red-500">Pending</i>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/order/${order?.orderId}`} passHref>
                      <Button variant="outlined" size="small" color="primary">
                        Details
                      </Button>
                    </Link>
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

export default OrderListScreen;