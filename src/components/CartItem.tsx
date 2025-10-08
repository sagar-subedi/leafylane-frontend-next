import React, { useEffect, useState } from "react";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import { useDispatch } from "react-redux";
import { Row, Col, ListGroup, Image, Form, Button } from "react-bootstrap";
import Link from "next/link";
import { getProductDetailApi } from "@/utils/RestApiCalls";
import Message from "@/components/Message";
import { getErrorMessage } from "@/utils/CommonUtils";
import { getCartDetails, removeFromCart } from "@/store/slices/cartSlice";
import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const removeFromCartHandler = async (cartItemId) => {
    //There may definitely a better way to do this
    // the second dispatch will make an api call to get the cart details
    // but probably we can update state and remove that specific cart item
    // from state directly, after the api call, to remove item from the cart
  // to obtain the lastest cart details
    await dispatch(removeFromCart(cartItemId));
    dispatch(getCartDetails());
  };

  return (
    <>
      {error ? (
        <Message variant="danger">{JSON.stringify(error)}</Message>
      ) : (
        <Box
          key={item.productId}
          className="flex items-center justify-between border-b pb-4 mb-4"
        >
          {/* Thumbnail */}
          <img
            src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product?.imageId}`}
            alt={item.productName}
            className="w-16 h-16 object-cover rounded-md"
          />

          {/* Product Name */}
          <Box className="flex-1 ml-4">
            <Link href={`/product/${item.productId}`} passHref>
              <Typography
                variant="body1"
                className="font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {item.productName}
              </Typography>
            </Link>
            <Typography variant="body2" className="text-gray-600">
              ${item.itemPrice}
            </Typography>
          </Box>

          {/* Quantity Selector */}
          <Box className="flex items-center">
            {product && (
              <Select
                value={item.quantity}
                onChange={(e) => addToCart(item.productId, e.target.value)}
                className="w-20"
                size="small"
              >
                {[...Array(Math.min(product.availableItemCount, 10)).keys()].map(
                  (x) => (
                    <MenuItem key={x + 1} value={x + 1}>
                      {x + 1}
                    </MenuItem>
                  )
                )}
              </Select>
            )}
          </Box>

          {/* Total Price */}
          <Typography variant="body1" className="font-bold text-gray-800">
            ${item.extendedPrice}
          </Typography>

          {/* Remove Button */}
          <IconButton
            color="error"
            onClick={() => removeFromCartHandler(item.cartItemId)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default CartItem;
