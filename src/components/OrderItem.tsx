import React, { useEffect, useState } from "react";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import Link from "next/link";
import Message from "./Message";
import Loader from "./Loader";
import { getProductDetailApi } from "@/utils/RestApiCalls";
import { getErrorMessage } from "@/utils/CommonUtils";
import { Box, Typography, Paper } from "@mui/material";

const OrderItem = ({ item }: { item: any }) => {
  const [product, setProduct] = useState<any>(null);
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

  if (error) {
    return <Message variant="danger">{JSON.stringify(error)}</Message>;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: '1px solid var(--color-border-light)',
        backgroundColor: 'var(--color-bg-subtle)',
        transition: 'all var(--transition-base)',
        '&:hover': {
          borderColor: 'var(--color-primary)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        {/* Product Image */}
        <Box
          sx={{
            width: { xs: '20%', sm: 80 },
            flexShrink: 0,
            position: 'relative',
            paddingTop: { xs: '20%', sm: 0 },
            height: { sm: 80 },
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'white',
          }}
        >
          {product?.imageId && (
            <img
              src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product.imageId}`}
              alt={item.productName}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </Box>

        {/* Product Name */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Link href={`/product/${item.productId}`} passHref style={{ textDecoration: 'none' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                mb: 0.5,
                '&:hover': { color: 'var(--color-primary)' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {product?.productName || "Unknown Product"}
            </Typography>
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              Price: <span style={{ fontWeight: 600 }}>${item.orderItemPrice}</span>
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              Qty: <span style={{ fontWeight: 600 }}>{item.quantity}</span>
            </Typography>
          </Box>
        </Box>

        {/* Total Price */}
        <Box sx={{ minWidth: { sm: 100 }, textAlign: 'right' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            ${item.orderExtendedPrice}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderItem;