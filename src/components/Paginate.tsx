"use client"; // Mark this component as a client component

import React from 'react';
import { Pagination } from 'react-bootstrap';
import Link from 'next/link';

const Paginate = ({ pages, page, isAdmin = false, link }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <Link key={x} href={`${link}/${x}`} passHref legacyBehavior>
            <Pagination.Item active={x === page}>{x + 1}</Pagination.Item>
          </Link>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;