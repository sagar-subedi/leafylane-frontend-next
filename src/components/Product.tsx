import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { BACKEND_API_GATEWAY_URL } from '@/constants/appConstants';

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
    <Card className="my-3 rounded" style={{ height: '400px' }}>
      <Link href={`/product/${product.productId}`} passHref legacyBehavior>
        <a>
          <Card.Img
            as={Image}
            src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product.imageId}`}
            alt={product.productName}
            width={250}
            height={250}
            style={{ height: '250px', objectFit: 'cover' }}
          />
        </a>
      </Link>
      <Card.Body>
        <Link href={`/product/${product.productId}`} passHref legacyBehavior>
          <a>
            <Card.Title as="div">
              <strong>{product.productName}</strong>
            </Card.Title>
          </a>
        </Link>

        <Card.Text as="div">
          <Rating value={product.averageRating} text={`${product.noOfRatings} reviews`} />
        </Card.Text>

        <Card.Text as="div" className="my-3">
          <p>${product.price}</p>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;