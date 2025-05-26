import React from 'react';
import { Box } from '@mui/material';
import { Star, StarHalf, StarBorder } from '@mui/icons-material';

const Rating = ({ value, text, color = '#FFD700' }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box display="flex" color={color}>
        <span>
          {value >= 1 ? <Star /> : value >= 0.5 ? <StarHalf /> : <StarBorder />}
        </span>
        <span>
          {value >= 2 ? <Star /> : value >= 1.5 ? <StarHalf /> : <StarBorder />}
        </span>
        <span>
          {value >= 3 ? <Star /> : value >= 2.5 ? <StarHalf /> : <StarBorder />}
        </span>
        <span>
          {value >= 4 ? <Star /> : value >= 3.5 ? <StarHalf /> : <StarBorder />}
        </span>
        <span>
          {value >= 5 ? <Star /> : value >= 4.5 ? <StarHalf /> : <StarBorder />}
        </span>
      </Box>
      {text && <Box ml={1}>{text}</Box>}
    </Box>
  );
};

Rating.defaultProps = {
  color: '#fee825',
};

export default Rating;