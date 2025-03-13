"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { listProductDetails, updateProduct } from "@/store/slices/productSlice";
import Loader from "@/components/Loader";
import Message from "@/components/Message";
import { PRODUCT_UPDATE_RESET } from "@/constants/productConstants";
import { uploadImageApi } from "@/utils/RestApiCalls";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [availableItemCount, setAvailableItemCount] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const { loading, error, product } = useSelector((state) => state.product);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector((state) => state.product.updateProduct);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      router.push("/admin/productlist");
    } else if (!product?.productName || product?.productId !== productId) {
      dispatch(listProductDetails(productId));
    } else {
      setProductName(product.productName);
      setPrice(product.price);
      setImage(product.imageId);
      setAvailableItemCount(product.availableItemCount);
      setDescription(product.description);
    }
  }, [dispatch, router, productId, product, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imageFile", file);
    setUploading(true);

    try {
      const { imageId } = await uploadImageApi({}, formData);
      setImage(imageId);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = () => {
    dispatch(updateProduct({ productId, productName, price, imageId: image, description, availableItemCount }));
  };

  return (
    <>
      <Link href="/admin/productlist" className="btn btn-dark my-3">
        Go Back
      </Link>
      <h1>Edit Product</h1>
      <hr />
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Form.Group controlId="image">
                {image && (
                  <Image
                    src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${image}`}
                    alt="Product Image"
                    width={400}
                    height={400}
                    style={{ objectFit: "contain" }}
                  />
                )}
                {uploading && <Loader />}
                <Form.Control type="file" onChange={uploadFileHandler} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
              </Form.Group>

              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
              </Form.Group>

              <Form.Group controlId="countInStock">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control type="number" value={availableItemCount} onChange={(e) => setAvailableItemCount(Number(e.target.value))} />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row className="m-5 justify-content-md-center">
            <Button type="button" variant="primary" onClick={submitHandler}>
              Update
            </Button>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductEditScreen;
