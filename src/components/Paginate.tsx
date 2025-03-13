import React from 'react';
import { Pagination } from 'react-bootstrap';
import Link from 'next/link';

const Paginate = ({ pages, page, isAdmin = false, link }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x} to={`${link}/${x}`}>
            <Pagination.Item active={x === page}>{x + 1}</Pagination.Item>
          </Link>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
