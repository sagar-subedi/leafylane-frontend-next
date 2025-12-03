"use client";

import React, { useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { listProducts, deleteProduct } from "@/store/slices/productSlice";
import { PRODUCT_CREATE_RESET } from "@/constants/productConstants";
import ReactPaginate from "react-paginate";
import { isAdmin } from "@/utils/CommonUtils";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InventoryIcon from "@mui/icons-material/Inventory";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const productList = useSelector((state: any) => state.product);
  const { loading, error, products, pageResponse } = productList;

  const productDelete = useSelector((state: any) => state.product.deleteProduct);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

  const productCreate = useSelector((state: any) => state.product.createProduct);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

  const userLogin = useSelector((state: any) => state.user);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo || !isAdmin()) {
      router.push("/login");
    }
    dispatch(listProducts(0) as any);
  }, [dispatch, router, userInfo, successDelete, successCreate, createdProduct]);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleClickOpen = (id: string) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const confirmDeleteHandler = () => {
    if (deleteId) {
      dispatch(deleteProduct(deleteId) as any);
    }
    handleClose();
  };

  const createProductHandler = () => {
    router.push("/admin/product/create");
  };

  const handlePageClick = (data: any) => {
    dispatch(listProducts(data.selected) as any);
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ fontSize: 32, color: 'white', mr: 2 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: 'white',
              }}
            >
              Product Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={createProductHandler}
            sx={{
              backgroundColor: 'white',
              color: 'var(--color-primary)',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              },
              transition: 'all var(--transition-base)',
            }}
          >
            Create Product
          </Button>
        </Box>
      </Paper>

      {/* Messages */}
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Products Table */}
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
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products?.map((product: any) => (
                    <TableRow
                      key={product.productId}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'var(--color-bg-subtle)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        #{product.productId.substring(0, 8)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {product.productName}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        ${product.price}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--color-text-muted)' }}>
                        {product.productCategory}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${product.availableItemCount} items`}
                          size="small"
                          color={product.availableItemCount > 10 ? "success" : product.availableItemCount > 0 ? "warning" : "error"}
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Edit Product">
                            <IconButton
                              component={Link}
                              href={`/admin/product/${product.productId}/edit`}
                              size="small"
                              sx={{
                                color: 'var(--color-primary)',
                                '&:hover': {
                                  backgroundColor: 'rgba(45, 106, 79, 0.08)',
                                },
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton
                              size="small"
                              onClick={() => handleClickOpen(product.productId)}
                              sx={{
                                color: 'var(--color-accent-warning)',
                                '&:hover': {
                                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                                },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
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

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 400,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Confirm Delete
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ color: 'var(--color-text-muted)' }}>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                sx={{
                  borderColor: 'var(--color-border-main)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'rgba(45, 106, 79, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteHandler}
                variant="contained"
                sx={{
                  backgroundColor: 'var(--color-accent-warning)',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  },
                }}
                autoFocus
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Pagination */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageResponse?.totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"page-item active"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-link"}
              nextClassName={"page-link"}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default ProductListScreen;