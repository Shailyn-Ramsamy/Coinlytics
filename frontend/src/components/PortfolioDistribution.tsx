import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

type Props = {
  distributionData: { name: string; value: number }[];
  colors: string[];
};

export default function PortfolioDistribution({ distributionData, colors }: Props) {
  return (
    <Grid size={{ xs: 12, md: 3 }} sx={{ display: "flex", flexDirection: "column" }}>
      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" gutterBottom sx={{ fontFamily: "monospace", fontWeight: 500, letterSpacing: ".05rem", mt: 1 }}>
            Portfolio Distribution
          </Typography>

          {distributionData.length === 0 ? (
            <Typography>No data to show.</Typography>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <Box sx={{ maxHeight: 150, overflowY: "auto", mt: 2, pr: 1 }}>
                {distributionData.map((entry, index) => (
                  <Typography
                    key={index}
                    variant="h6"
                    sx={{
                      color: colors[index % colors.length],
                      fontFamily: "monospace",
                      fontWeight: 400,
                      letterSpacing: ".02rem",
                      mt: 1,
                    }}
                  >
                    {entry.name}: {entry.value.toFixed(2)} USD
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}