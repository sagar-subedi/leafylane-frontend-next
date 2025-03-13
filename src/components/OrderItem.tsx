import React, { useEffect, useState } from 'react';
import { BACKEND_API_GATEWAY_URL } from '@/constants/appConstants';
import { Col, Image, ListGroup, Row } from 'react-bootstrap';
import Link from 'next/link';
import Message from './Message';
import { getProductDetailApi } from '@/utils/RestApiCalls';
import { getErrorMessage } from '@/utils/CommonUtils';
import Loader from './Loader';

const OrderItem = ({ item }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDetail = await getProductDetailApi(item.productId);
        setProduct(productDetail);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [item.productId]);

  return (
    <>
      {error && <Message variant="danger">{JSON.stringify(error)}</Message>}
      {loading ? (
        <Loader />
      ) : (
        <ListGroup.Item key={item.productId}>
          <Row>
            <Col md={2}>
              <Image
                src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product?.imageId}`}
                alt={item.productName}
                fluid
                rounded
              />
            </Col>
            <Col md={3} className="pt-4">
              <Link href={`/product/${item.productId}`}>{product?.productName || 'Unknown Product'}</Link>
            </Col>
            <Col md={2} className="pt-4">${item.orderItemPrice}</Col>
            <Col md={2} className="pt-4">{item.quantity}</Col>
            <Col md={1} className="pt-4">${item.orderExtendedPrice}</Col>
          </Row>
        </ListGroup.Item>
      )}
    </>
  );
};

export default OrderItem;
