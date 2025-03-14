"use client";
import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
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
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order?.orderId}>
                <td>{order?.orderId}</td>
                <td>{order?.created_at?.substring(0, 10)}</td>
                <td>${order?.totalPrice}</td>
                <td>
                  {order?.paid ? order?.paymentDate?.substring(0, 10) : <i className="fas fa-times" style={{ color: "red" }}></i>}
                </td>
                <td>
                  {order?.delivered ? order?.deliveredDate?.substring(0, 10) : <i className="fas fa-times" style={{ color: "red" }}></i>}
                </td>
                <td>
                  <Link href={`/order/${order?.orderId}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
