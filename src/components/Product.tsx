import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Rating from './Rating';
import { BACKEND_API_GATEWAY_URL } from '@/constants/appConstants';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface ProductProps {
  product: {
    productId: string;
    productName: string;
    imageId: string;
    averageRating: number;
    noOfRatings: number;
    price: number;
    countInStock?: number;
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isLowStock = product.countInStock && product.countInStock < 5;

  return (
    <Card
      className="card-hover"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'var(--color-border-light)',
        boxShadow: 'var(--shadow-md)',
        transition: 'all var(--transition-base)',
        '&:hover': {
          borderColor: 'var(--color-primary-lighter)',
        },
      }}
    >
      <Link href={`/product/${product.productId}`} passHref style={{ textDecoration: 'none' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 280,
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-subtle)',
          }}
        >
          {/* Stock Badge */}
          {isLowStock && (
            <Chip
              icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
              label="Low Stock"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2,
                backgroundColor: 'var(--color-accent-warning)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}

          {/* Image with zoom effect */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform var(--transition-base)',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Image
              src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product.imageId}`}
              alt={product.productName}
              fill
              style={{
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <Box
                className="skeleton"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            )}
          </Box>
        </Box>
      </Link>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: 3,
        }}
      >
        <Link href={`/product/${product.productId}`} passHref style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
              mb: 0.5,
              transition: 'color var(--transition-fast)',
              '&:hover': {
                color: 'var(--color-primary)',
              },
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.productName}
          </Typography>
        </Link>

        <Box sx={{ my: 0.5 }}>
          <Rating
            value={product.averageRating}
            text={`${product.noOfRatings} ${product.noOfRatings === 1 ? 'review' : 'reviews'}`}
          />
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: '1.5rem',
              color: 'var(--color-primary)',
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Product;