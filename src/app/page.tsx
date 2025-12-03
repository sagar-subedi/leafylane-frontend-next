"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Product from "@/components/Product";
import FullPageLoader from "@/components/FullPageLoader";
import { listProducts } from "@/store/slices/productSlice";
import { setupAxiosInterceptors } from "../utils/refreshTokenInterceptor";
import { Container, Box, Typography } from "@mui/material";
import Paginate from "@/components/Paginate";
import HeroCarousel from "@/components/HeroCarousel";
import Link from "next/link";

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { products, page, pages, loading, error } = useAppSelector(
    (state) => state.product
  );

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const pageResponse = searchParams.get("page") || "1";

  useEffect(() => {
    setupAxiosInterceptors(dispatch);
  }, [dispatch]);

  useEffect(() => {
    dispatch(listProducts({ keyword, pageNumber: Number(pageResponse) }));
  }, [dispatch, keyword, pageResponse]);

  const handlePageClick = (pageNumber: number) => {
    dispatch(listProducts({ keyword, pageNumber }));
  };

  return (
    <>
      {/* Hero Carousel - Full Width */}
      <HeroCarousel />

      {/* Products Section - Contained */}
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
              fontFamily: "'Inter', sans-serif",
              color: '#52796F',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Explore our curated collection of premium plants
          </Typography>
        </Box>

        {error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
                mb: 6,
              }}
            >
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </Box>

            {pages && pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paginate
                  pages={pages}
                  page={page ?? 1}
                  keyword={keyword}
                  changeHandler={handlePageClick}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default HomeScreen;
