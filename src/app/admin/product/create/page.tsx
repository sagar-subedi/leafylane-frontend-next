"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { BACKEND_API_GATEWAY_URL } from '@/constants/appConstants';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Link from 'next/link';
import { createProduct } from '@/store/slices/productSlice';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import { uploadImageApi, getProductCategories } from '@/utils/RestApiCalls';

const ProductCreateScreen = () => {
  const router = useRouter();
  const { id: productId } = useParams();

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [availableItemCount, setAvailableItemCount] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [productCategory, setProductCategory] = useState('');

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.product);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getProductCategories();
        setProductCategories(res.page.content);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, [dispatch, productId, product]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imageFile', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { imageId } = await uploadImageApi(config, formData);
      setImage(imageId);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        productId,
        productName,
        price,
        imageId: image,
        description,
        availableItemCount,
        productCategoryId: productCategory,
      })
    );
    router.push('/admin/productlist');
  };

  return (
    <>
      <Link href="/admin/productlist" className="btn btn-dark my-3">
        Go Back
      </Link>

      <h1>Create Product</h1>
      <hr />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={4}>
              <Form.Group controlId="image">
                {image && (
                  <img
                    src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${image}`}
                    alt="Product"
                    className="img-fluid rounded"
                    style={{ height: '400px' }}
                  />
                )}
                {uploading && <Loader />}
              </Form.Group>
              <Form.Control type="file" className="mt-3" onChange={uploadFileHandler} />
            </Col>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="countInStock">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter stock count"
                  value={availableItemCount}
                  onChange={(e) => setAvailableItemCount(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="productCategory">
                <Form.Label>Product Category</Form.Label>
                <Form.Control
                  as="select"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  required
                >
                  <option value="">Select Product Category</option>
                  {productCategories.length > 0 &&
                    productCategories.map((pc) => (
                      <option key={pc.productCategoryId} value={pc.productCategoryId}>
                        {pc.productCategoryName}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" className="mt-3">
                Create Product
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default ProductCreateScreen;
