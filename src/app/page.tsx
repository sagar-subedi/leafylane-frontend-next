"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Product from "@/components/Product";
import FullPageLoader from "@/components/FullPageLoader";
import { listProducts } from "@/store/slices/productSlice";
import { setupAxiosInterceptors } from "../utils/refreshTokenInterceptor";
import { Container, Box, Typography } from "@mui/material";
import Paginate from "@/components/Paginate";
import HeroCarousel from "@/components/HeroCarousel";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { products, page, pages, loading, error } = useSelector(
    (state: any) => state.product
  );

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const pageResponse = searchParams.get("page") || "1";

  useEffect(() => {
    setupAxiosInterceptors(dispatch);
  }, [dispatch]);

  useEffect(() => {
    dispatch(listProducts(Number(pageResponse) - 1) as any);
  }, [dispatch, keyword, pageResponse]);

  const handlePageClick = (pageNumber: number) => {
    dispatch(listProducts(pageNumber - 1) as any);
  };

  return (
    <>
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
              {products.map((product: any) => (
                <Product key={product._id || product.productId} product={product} />
              ))}
            </Box>

            {pages && pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paginate
                  pages={pages}
                  page={page ?? 1}
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
