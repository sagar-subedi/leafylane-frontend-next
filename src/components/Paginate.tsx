"use client"; // Mark this component as a client component

import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import Link from 'next/link';

const Paginate = ({ pages, page, isAdmin = false, link }) => {
  if (pages <= 1) return null; // Don't render pagination if there's only one page

  return (
    <div className="flex justify-center mt-4">
      apple
      <Pagination
        count={pages}
        page={page}
        variant="outlined"
        shape="rounded"
        renderItem={(item) => (
          <PaginationItem
            {...item}
            component={Link}
            href={`${link}/${item.page - 1}`} // Adjust page index for 0-based routing
            className="hover:bg-gray-200"
          />
        )}
        classes={{
          ul: 'flex justify-center', // Tailwind for centering
        }}
      />
    </div>
  );
};

export default Paginate;