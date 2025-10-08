import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Rating from './Rating';
import { BACKEND_API_GATEWAY_URL } from '@/constants/appConstants';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface ProductProps {
  product: {
    productId: string;
    productName: string;
    imageId: string;
    averageRating: number;
    noOfRatings: number;
    price: number;
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <Box
      component={Card}
      className="rounded-lg shadow-md transition-transform duration-500 ease-in-out bg-gray-50 hover:bg-gray-100 hover:shadow-xl hover:-translate-y-1"
    >
      <Link href={`/product/${product.productId}`} passHref>
        <Image
          src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product.imageId}`}
          alt={product.productName}
          width={250}
          height={250}
          className="rounded-t-lg object-cover w-full h-64"
        />
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.productId}`} passHref>
          <Typography
            variant="h6"
            component="h2"
            className="font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {product.productName}
          </Typography>
        </Link>

        <div className="my-2">
          <Rating value={product.averageRating} text={`${product.noOfRatings} reviews`} />
        </div>

        <Typography variant="body1" className="text-lg font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
    </Box>
  );
};

export default Product;