import React, { useEffect, useState } from "react";
import { BACKEND_API_GATEWAY_URL } from "@/constants/appConstants";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { getProductDetailApi } from "@/utils/RestApiCalls";
import Message from "@/components/Message";
import { getErrorMessage } from "@/utils/CommonUtils";
import { getCartDetails, removeFromCart } from "@/store/slices/cartSlice";
import { Box, IconButton, MenuItem, Select, Typography, Paper, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const CartItem = ({ item, addToCart }: { item: any; addToCart: any }) => {
  const [product, setProduct] = useState<any>(null);
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

  const removeFromCartHandler = async (cartItemId: any) => {
    await dispatch(removeFromCart(cartItemId) as any);
    dispatch(getCartDetails() as any);
  };

  if (error) {
    return <Message variant="danger">{JSON.stringify(error)}</Message>;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: '1px solid var(--color-border-light)',
        transition: 'all var(--transition-base)',
        '&:hover': {
          borderColor: 'var(--color-primary)',
          boxShadow: 'var(--shadow-sm)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        {/* Thumbnail */}
        <Box
          sx={{
            width: { xs: '25%', sm: 100 },
            flexShrink: 0,
            position: 'relative',
            paddingTop: { xs: '25%', sm: 0 },
            height: { sm: 100 },
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-subtle)',
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

        {/* Product Info */}
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
              {item.productName}
            </Typography>
          </Link>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Unit Price: <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>${item.itemPrice}</span>
          </Typography>
        </Box>

        {/* Quantity Selector */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1, color: 'var(--color-text-muted)', display: { xs: 'none', sm: 'block' } }}>
            Qty:
          </Typography>
          {product && (
            <Select
              value={item.quantity}
              onChange={(e) => addToCart(item.productId, e.target.value)}
              size="small"
              sx={{
                minWidth: 70,
                height: 36,
                borderRadius: 1,
                backgroundColor: 'var(--color-bg-subtle)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-border-main)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary)',
                },
              }}
            >
              {[...Array(Math.min(product.availableItemCount, 10)).keys()].map((x) => (
                <MenuItem key={x + 1} value={x + 1}>
                  {x + 1}
                </MenuItem>
              ))}
            </Select>
          )}
        </Box>

        {/* Total Price & Remove */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: { sm: 120 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary)', mr: 2 }}>
            ${item.extendedPrice}
          </Typography>
          <Tooltip title="Remove item">
            <IconButton
              onClick={() => removeFromCartHandler(item.cartItemId)}
              sx={{
                color: 'var(--color-text-muted)',
                '&:hover': {
                  color: 'var(--color-accent-warning)',
                  backgroundColor: 'rgba(220, 38, 38, 0.08)',
                },
              }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default CartItem;
