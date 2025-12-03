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
  Container,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { listOrdersAdmin } from "@/store/slices/orderSlice";
import Link from "next/link";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const OrderListScreen = () => {
  const dispatch = useDispatch();

  const orderList = useSelector((state: any) => state.order.listOrders);
  const { loading, error, orders } = orderList;

  useEffect(() => {
    dispatch(listOrdersAdmin() as any);
  }, [dispatch]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: '1px solid var(--color-border-light)',
          background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptLongIcon sx={{ fontSize: 32, color: 'white', mr: 2 }} />
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: 'white',
            }}
          >
            Order Management
          </Typography>
        </Box>
      </Paper>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid var(--color-border-light)',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'var(--color-bg-subtle)' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Payment Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Delivery Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders?.map((order: any) => (
                  <TableRow
                    key={order?.orderId}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'var(--color-bg-subtle)',
                      },
                    }}
                  >
                    <TableCell sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                      #{order?.orderId}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--color-text-muted)' }}>
                      {order?.created_at?.substring(0, 10)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      ${order?.totalPrice}
                    </TableCell>
                    <TableCell>
                      {order?.paid ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={`Paid ${order?.paymentDate?.substring(0, 10)}`}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      ) : (
                        <Chip
                          icon={<CancelIcon />}
                          label="Pending"
                          color="error"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {order?.delivered ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={`Delivered ${order?.deliveredDate?.substring(0, 10)}`}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      ) : (
                        <Chip
                          icon={<AccessTimeIcon />}
                          label="Pending"
                          color="warning"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            component={Link}
                            href={`/order/${order?.orderId}`}
                            size="small"
                            sx={{
                              color: 'var(--color-primary)',
                              '&:hover': {
                                backgroundColor: 'rgba(45, 106, 79, 0.08)',
                              },
                            }}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default OrderListScreen;