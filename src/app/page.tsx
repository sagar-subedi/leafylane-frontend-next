"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "@/components/Product";
import Message from "@/components/Message";
import FullPageLoader from "@/components/FullPageLoader";
import { listProducts } from "@/store/slices/productSlice";
import { setupAxiosInterceptors } from "../utils/refreshTokenInterceptor";
import { Container, Box, Typography, Button } from "@mui/material";
import Paginate from "@/components/Paginate";
import TechStackSection from "@/components/TechStackSection";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
      {/* Hero Section */}
      <Box
        className="gradient-primary animate-fadeIn"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 12 },
          width: '100%',
          margin: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Box className="flex justify-center mb-4 animate-slideDown">
              <LocalFloristIcon
                sx={{
                  fontSize: { xs: 60, md: 80 },
                  color: 'rgba(255, 255, 255, 0.9)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                }}
              />
            </Box>

            <Typography
              variant="h2"
              className="animate-slideUp"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                color: 'white',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              Welcome to LeafyLane
            </Typography>

            <Typography
              variant="h5"
              className="animate-slideUp"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                lineHeight: 1.6,
              }}
            >
              Discover beautiful plants that bring life to your space
            </Typography>

            <Link href="/cart" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                className="animate-scaleIn"
                sx={{
                  backgroundColor: 'white',
                  color: '#2D6A4F',
                  fontWeight: 600,
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#F8FBF9',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Shop Now
              </Button>
            </Link>
          </Box>
        </Container>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            filter: 'blur(40px)',
          }}
        />
      </Box>

      {/* Products Section */}
      <Container maxWidth="xl" sx={{ mb: 8 }}>
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

      {/* Tech Stack Section */}
      <TechStackSection />

      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default HomeScreen;
