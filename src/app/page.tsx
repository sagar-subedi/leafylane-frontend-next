"use client";
// import { SET_NAME } from "@/store/slices/profileSlice";
// import Image from "next/image";
// import { useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";

// function DisplayName() {
//   const { name } = useSelector((state) => state.profile);
//   return (
//     <h1> I am {name} !!</h1>
//   );
// }
// export default function Home() {
//   const inputName = useRef("");
//   const dispatch = useDispatch();
//   function submitName() {
//     dispatch(SET_NAME(inputName.current.value));
//   }
//   return (
//     <>
//       <main>
//         <input placeholder='enter name' ref={inputName} />
//         <button onClick={submitName}>Enter name</button>
//         <DisplayName />
//       </main>
//     </>
//   );
// }

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "@/components/Product";
import Message from "@/components/Message";
import { Col, Row } from "react-bootstrap";
import FullPageLoader from "@/components/FullPageLoader";
import ReactPaginate from "react-paginate";
import { listProducts } from "@/store/slices/productSlice";
import { setupAxiosInterceptors } from "../utils/refreshTokenInterceptor";
import { Pagination } from "@mui/material";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product);
  const { loading, error, products, pageResponse } = productList;

  setupAxiosInterceptors();

  useEffect(() => {
    dispatch(listProducts(0));
  }, [dispatch]);

  const handlePageClick = (data) => {
    const selected = data.selected;
    dispatch(listProducts(selected));
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Latest Products
      </h1>
      {error ? (
        <Message variant="danger">Something wrong happened</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl px-4">
            {products.map((product) => (
              <div key={product.productId}>
                <Product product={product} />
              </div>
            ))}
          </div>
          {/* pageResponse?.pageable?.pageNumber */}
          <div className="flex justify-center mt-6">
            <Pagination
              count={pageResponse?.totalPages || 0}
              page={pageResponse?.pageable?.pageNumber + 1 || 1}
              onChange={(event, page) =>
                handlePageClick({ selected: page - 1 })
              }
              variant="outlined"
              shape="rounded"
              color="primary"
            />
          </div>
        </>
      )}
      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default HomeScreen;
