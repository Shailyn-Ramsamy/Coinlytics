import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { StockGrowthPoint } from '../external_api/Twelvedata';

type Props = {
  growthData: StockGrowthPoint[];
  loading: boolean;
};

export default function PortfolioStats({ growthData, loading }: Props) {
  const initial = growthData[0]?.value || 0;
  const current = growthData[growthData.length - 1]?.value || 0;
  const profitLoss = current - initial;
  const isProfit = profitLoss >= 0;
  const percentChange = initial !== 0 ? ((profitLoss / initial) * 100).toFixed(2) : "0.00";

  const StatCard = ({ title, value, color }: { title: string; value: string; color?: string }) => (
    <Grid size={{ xs: 12, md: title === 'Return' ? 6 : 3 }} sx={{ display: "flex", flexDirection: "column" }}>
      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          {loading || !growthData.length ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={100}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
              {value}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <>
      <StatCard title="Initial Invested" value={`$${initial}`} />
      <StatCard title="Current Value" value={`$${current}`} />
      <StatCard 
        title="Return" 
        value={`${isProfit ? "+" : "-"}$${Math.abs(profitLoss).toFixed(2)} (${isProfit ? "+" : "-"}${Math.abs(parseFloat(percentChange)).toFixed(2)}%)`}
        color={isProfit ? "green" : "red"}
      />
    </>
  );
}