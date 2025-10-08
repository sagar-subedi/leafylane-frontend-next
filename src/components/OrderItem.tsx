import React, { useEffect, useState } from "react";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import Link from "next/link";
import Message from "./Message";
import Loader from "./Loader";
import { getProductDetailApi } from "@/utils/RestApiCalls";
import { getErrorMessage } from "@/utils/CommonUtils";
import { Box, Typography } from "@mui/material";

const OrderItem = ({ item }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
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
        <Box
          key={item.productId}
          className="flex items-center justify-between border-b pb-4 mb-4"
        >
          {/* Product Image */}
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
                {product?.productName || "Unknown Product"}
              </Typography>
            </Link>
          </Box>

          {/* Price */}
          <Typography variant="body1" className="text-gray-600">
            ${item.orderItemPrice}
          </Typography>

          {/* Quantity */}
          <Typography variant="body1" className="text-gray-600">
            {item.quantity}
          </Typography>

          {/* Total Price */}
          <Typography variant="body1" className="font-bold text-gray-800">
            ${item.orderExtendedPrice}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default OrderItem;