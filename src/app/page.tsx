"use client"
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






import Paginate from '@/components/Paginate';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Product from '@/components/Product';
import Message from '@/components/Message';
import { Col, Row } from 'react-bootstrap';
import FullPageLoader from '@/components/FullPageLoader';
import ReactPaginate from 'react-paginate';
import { listProducts } from '@/store/slices/productSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product);
  const { loading, error, products, pageResponse } = productList;

  useEffect(() => {
    dispatch(listProducts(0));
  }, [dispatch]);

  const handlePageClick = (data) => {
    let selected = data.selected;
    dispatch(listProducts(selected));
  };

  return (
    <>
      <h1>Latest Products</h1>
      {error ? (
        <Message variant='danger'></Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product.productId} sm={12} md={6} lg={4} xl={3}>
                <Product key={product.productId} product={product}></Product>
              </Col>
            ))}
          </Row>
          {/* pageResponse?.pageable?.pageNumber */}
          <Row className='m-5 justify-content-md-center'>
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageResponse?.totalPages}
              marginPagesDisplayed={50}
              pageRangeDisplayed={10}
              onPageChange={(e) => handlePageClick(e)}
              containerClassName={'pagination'}
              activeClassName={'page-item active'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-link'}
              nextClassName={'page-link'}
            />
          </Row>
        </>
      )}
      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default HomeScreen;
