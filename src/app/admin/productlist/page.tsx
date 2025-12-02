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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { listProducts, deleteProduct } from "@/store/slices/productSlice";
import { PRODUCT_CREATE_RESET } from "@/constants/productConstants";
import ReactPaginate from "react-paginate";
import { isAdmin } from "@/utils/CommonUtils";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const productList = useSelector((state) => state.product);
  const { loading, error, products, pageResponse } = productList;

  const productDelete = useSelector((state) => state.product.deleteProduct);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

  const productCreate = useSelector((state) => state.product.createProduct);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo || !isAdmin()) {
      router.push("/login");
    }
    dispatch(listProducts(0));
  }, [dispatch, router, userInfo, successDelete, successCreate, createdProduct]);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleClickOpen = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const confirmDeleteHandler = () => {
    if (deleteId) {
      dispatch(deleteProduct(deleteId));
    }
    handleClose();
  };

  const createProductHandler = () => {
    router.push("/admin/product/create");
  };

  const handlePageClick = (data) => {
    dispatch(listProducts(data.selected));
  };

  return (
    <Box className="max-w-7xl mx-auto px-4 py-8">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={createProductHandler}
          className="text-white"
        >
          <i className="fas fa-plus mr-2"></i> Create Product
        </Button>
      </Box>

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
          <TableContainer component={Paper} className="shadow-md">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>NAME</TableCell>
                  <TableCell>PRICE</TableCell>
                  <TableCell>CATEGORY</TableCell>
                  <TableCell>IMAGE ID</TableCell>
                  <TableCell>AVAILABLE ITEM COUNT</TableCell>
                  <TableCell>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.productId}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.productCategory}</TableCell>
                    <TableCell>{product.imageId}</TableCell>
                    <TableCell>{product.availableItemCount}</TableCell>
                    <TableCell>
                      <Box className="flex gap-2">
                        <Link href={`/admin/product/${product.productId}/edit`} passHref>
                          <Button variant="outlined" size="small" color="primary">
                            <i className="fas fa-edit"></i> Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleClickOpen(product.productId)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Confirm Delete"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDeleteHandler} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Pagination */}
          <Box className="mt-6 flex justify-center">
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
    </Box>
  );
};

export default ProductListScreen;