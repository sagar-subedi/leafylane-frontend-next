"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "@/components/Product";
import Message from "@/components/Message";
import FullPageLoader from "@/components/FullPageLoader";
import { listProducts } from "@/store/slices/productSlice";
import { setupAxiosInterceptors } from "../utils/refreshTokenInterceptor";
import { Container, Box, Typography } from "@mui/material";
import Paginate from "@/components/Paginate";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state: any) => state.product);
  const { loading, error, products, pageResponse } = productList;

  setupAxiosInterceptors();

  useEffect(() => {
    dispatch(listProducts(0) as any);
  }, [dispatch]);

  const handlePageClick = (data: any) => {
    const selected = data.selected;
    dispatch(listProducts(selected) as any);
  };

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Products Section */}
      <Container maxWidth="xl" sx={{ mb: 8, mt: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            className="animate-slideUp"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              color: '#1B4332',
              mb: 2,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
            }}
          >
            Latest Products
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#6B7280',
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Explore our curated collection of beautiful plants
          </Typography>
        </Box>

        {error ? (
          <Message variant="danger">Something wrong happened</Message>
        ) : (
          <>
            <Box
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              sx={{
                mb: 6,
              }}
            >
              {products.map((product: any, index: number) => (
                <Box
                  key={product.productId}
                  className="animate-slideUp"
                  sx={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Product product={product} />
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            <Box className="flex justify-center">
              <Paginate
                pages={pageResponse?.totalPages || 0}
                page={pageResponse?.pageable?.pageNumber + 1 || 1}
                changeHandler={(page) => handlePageClick({ selected: page - 1 })}
              />
            </Box>
          </>
        )}
      </Container>

      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default HomeScreen;
