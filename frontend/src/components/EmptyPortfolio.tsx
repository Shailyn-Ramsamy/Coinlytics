import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type Props = {
  onAddClick: () => void;
};

export default function EmptyPortfolio({ onAddClick }: Props) {
  return (
    <Box p={3} textAlign="center">
      <Typography variant="h5" gutterBottom>
        You have no stock investments.
      </Typography>
      <Box
        component="img"
        src="/empty_portfolio.svg"
        alt="No investments"
        sx={{ width: 300, mt: 2 }}
      />
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{ height: 56 }}
        >
          Add Investment
        </Button>
      </Box>
    </Box>
  );
}