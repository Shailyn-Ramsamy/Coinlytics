import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StockGrowthPoint } from '../external_api/Twelvedata';

type Props = {
  growthData: StockGrowthPoint[];
  loading: boolean;
  selectedStockName?: string;
  selectedColor: string;
};

export default function PerformanceChart({ growthData, loading, selectedStockName, selectedColor }: Props) {
  return (
    <Grid size={{ xs: 12, md: 9 }} sx={{ display: "flex", flexDirection: "column" }}>
      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" gutterBottom>
            {selectedStockName ? `Performance of ${selectedStockName}` : "Select a stock"}
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
              <CircularProgress />
            </Box>
          ) : (
            <ResponsiveContainer width="100%">
              <LineChart data={growthData}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={selectedColor}
                  strokeWidth={2}
                  dot={growthData.length < 50}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}