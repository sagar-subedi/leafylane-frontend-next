"use client";

import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import Link from 'next/link';

interface PaginateProps {
  pages: number;
  page: number;
  isAdmin?: boolean;
  link?: string;
  changeHandler?: (page: number) => void;
}

const Paginate = ({ pages, page, isAdmin = false, link = '', changeHandler }: PaginateProps) => {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <Pagination
        count={pages}
        page={page}
        variant="outlined"
        shape="rounded"
        size="large"
        onChange={changeHandler ? (e, value) => changeHandler(value) : undefined}
        renderItem={(item) => (
          changeHandler ? (
            <PaginationItem
              {...item}
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-dark)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(45, 106, 79, 0.08)',
                },
              }}
            />
          ) : (
            <PaginationItem
              {...item}
              component={Link}
              href={item.page === 1 ? link : `${link}/${item.page}`}
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-dark)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(45, 106, 79, 0.08)',
                },
              }}
            />
          )
        )}
      />
    </div>
  );
};

export default Paginate;