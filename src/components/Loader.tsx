import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
