import React, { useEffect, useState } from "react";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import { useDispatch } from "react-redux";
import { Row, Col, ListGroup, Image, Form, Button } from "react-bootstrap";
import Link from "next/link";
import { getProductDetailApi } from "@/utils/RestApiCalls";
import Message from "@/components/Message";
import { getErrorMessage } from "@/utils/CommonUtils";
import { removeFromCart } from "@/store/slices/cartSlice";

const CartItem = ({ item, addToCart }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetail = await getProductDetailApi(item.productId);
        setProduct(productDetail);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [item]);

  const removeFromCartHandler = (cartItemId) => {
    dispatch(removeFromCart(cartItemId));
  };

  return (
    <>
      {error ? (
        <Message variant="danger">{JSON.stringify(error)}</Message>
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
              <Link href={`/product/${item.productId}`}>{item.productName}</Link>
            </Col>
            <Col md={2} className="pt-4">
              ${item.itemPrice}
            </Col>
            <Col md={2} className="pt-3">
              {product && (
                <Form.Control
                  as="select"
                  value={item.quantity}
                  onChange={(e) => addToCart(item.productId, e.target.value)}
                >
                  {[...Array(Math.min(product.availableItemCount, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </Form.Control>
              )}
            </Col>
            <Col md={1} className="pt-4">
              ${item.extendedPrice}
            </Col>
            <Col md={2} className="pt-3 pl-5">
              <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.cartItemId)}>
                <i className="fas fa-trash"></i>
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>
      )}
    </>
  );
};

export default CartItem;
