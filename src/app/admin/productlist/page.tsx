"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { isAdmin } from "@/utils/CommonUtils";
import Message from "@/components/Message";
import Loader from "@/components/Loader";
import { listProducts, deleteProduct } from "@/store/slices/productSlice";
import { PRODUCT_CREATE_RESET } from "@/constants/productConstants";
import ReactPaginate from "react-paginate";

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

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    router.push("/admin/product/create");
  };

  const handlePageClick = (data) => {
    dispatch(listProducts(data.selected));
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
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
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>IMAGE ID</th>
                <th>AVAILABLE ITEM COUNT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>${product.price}</td>
                  <td>{product.productCategory}</td>
                  <td>{product.imageId}</td>
                  <td>{product.availableItemCount}</td>
                  <td>
                    <Link href={`/admin/product/${product.productId}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product.productId)}>
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Row className="m-5 justify-content-md-center">
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
      </Row>
    </>
  );
};

export default ProductListScreen;