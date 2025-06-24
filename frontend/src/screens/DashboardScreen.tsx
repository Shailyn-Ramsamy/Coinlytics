import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  fetchStockGrowth,
  StockGrowthPoint,
  fetchUserStocks,
  postStockPurchase,
  fetchUserDistribution,
  fetchTotalPortfolioGrowth,
} from "../external_api/Twelvedata";
import AddIcon from "@mui/icons-material/Add";
import AddStockModal from "../components/StockModal";
import PortfolioStats from "../components/PortfolioStats";
import PerformanceChart from "../components/PerformanceChart";
import PortfolioDistribution from "../components/PortfolioDistribution";
import EmptyPortfolio from "../components/EmptyPortfolio";

export default function Dashboard() {
  const [growthData, setGrowthData] = useState<StockGrowthPoint[]>([]);
  const [stockList, setStockList] = useState<
    { id: number; name: string; symbol: string }[]
  >([]);
  const [selectedStock, setSelectedStock] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [distributionData, setDistributionData] = useState<
    { name: string; value: number }[]
  >([]);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const growthCache = React.useRef<{ [stockId: number]: StockGrowthPoint[] }>(
    {}
  );
  const distributionCache = React.useRef<{
    [userId: number]: { name: string; value: number }[] | undefined;
  }>({});

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
  ];

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const loadDistribution = async () => {
    const cached = distributionCache.current[userInfo.id];
    if (cached) {
      setDistributionData(cached);
      return;
    }

    try {
      const data = await fetchUserDistribution(userInfo.id);
      distributionCache.current[userInfo.id] = data;
      setDistributionData(data);
    } catch (err) {
      console.error("Failed to load portfolio distribution", err);
    }
  };

  useEffect(() => {
    loadDistribution();
  }, []);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await fetchUserStocks(userInfo.id);

        const fullList = [
          { id: 0, symbol: "ALL", name: "Total Portfolio" },
          ...stocks,
        ];

        setStockList(fullList);

        setSelectedStock(0);
      } catch (err) {
        console.error("Failed to load stock list", err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadStocks();
  }, []);

  useEffect(() => {
    if (selectedStock === "" || selectedStock === undefined) return;

    const loadGrowthData = async () => {
      const cached = growthCache.current[selectedStock];
      if (cached) {
        setGrowthData(cached);
        return;
      }

      setLoading(true);
      try {
        let data;

        if (selectedStock === 0) {
          data = await fetchTotalPortfolioGrowth(userInfo.id);
        } else {
          data = await fetchStockGrowth(userInfo.id, selectedStock);
        }

        growthCache.current[selectedStock] = data;
        setGrowthData(data);
      } catch (err) {
        console.error("Error loading growth data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGrowthData();
  }, [selectedStock]);


  const handleStockAdded = async (newStock: {
    stock_id: number;
    purchase_date: string;
    amount_spent: number;
  }) => {
    try {
      console.log("Posting stock purchase to backend:", newStock);

      await postStockPurchase(userInfo.id, newStock);

      const updated = await fetchUserStocks(userInfo.id);
      const fullList = [
        { id: 0, symbol: "ALL", name: "Total Portfolio" },
        ...updated,
      ];
      setStockList(fullList);

      distributionCache.current[userInfo.id] = undefined;
      await loadDistribution();

      growthCache.current = {};

      setSelectedStock(newStock.stock_id);
    } catch (error: any) {
      console.error("Failed to add stock purchase:", error);
      
      // Handle specific error cases
      if (error.response?.data?.detail) {
        setErrorAlert(error.response.data.detail);
      } else if (error.response?.status === 404) {
        setErrorAlert("No stock price data available for the selected date. Please try a different date or stock.");
      } else {
        setErrorAlert("Failed to add stock purchase. Please try again.");
      }
    }
  };

  const selectedStockName = stockList.find((s) => s.id === selectedStock)?.name;
  const selectedIndex = distributionData.findIndex((d) => d.name === selectedStockName);
  const selectedColor = COLORS[selectedIndex % COLORS.length] || "#8884d8";

  if (initialLoading) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading your portfolio...</Typography>
      </Box>
    );
  }

  if (!initialLoading && stockList.length === 1) {
    return (
      <>
        <AddStockModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddStock={handleStockAdded}
        />
        <EmptyPortfolio onAddClick={() => setModalOpen(true)} />
      </>
    );
  }

  return (
    <Box
      p={3}
      sx={{ minHeight: "80vh", display: "flex", flexDirection: "column" }}
    >
      <AddStockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddStock={handleStockAdded}
      />
      <Typography variant="h4">Stock Portfolio Performance</Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        mt={4}
      >
        <FormControl sx={{ flex: 1, minWidth: 200, mr: 2 }}>
          <InputLabel id="stock-select-label">Select Stock</InputLabel>
          <Select
            labelId="stock-select-label"
            value={selectedStock}
            label="Select Stock"
            onChange={(e) => setSelectedStock(Number(e.target.value))}
          >
            {stockList.map((stock) => (
              <MenuItem key={stock.id} value={stock.id}>
                {stock.name} ({stock.symbol})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
            sx={{ 
              height: 56,
              minWidth: { xs: 56, sm: 'auto' },
              px: { xs: 1, sm: 2 }
            }}
          >
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', alignItems: 'center' }}>
              <AddIcon />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <AddIcon />
              Add Investment
            </Box>
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1 }}>
        <PortfolioStats growthData={growthData} loading={loading} />
        <PerformanceChart 
          growthData={growthData} 
          loading={loading} 
          selectedStockName={selectedStockName}
          selectedColor={selectedColor}
        />
        <PortfolioDistribution distributionData={distributionData} colors={COLORS} />
      </Grid>
      
      <Snackbar 
        open={!!errorAlert} 
        autoHideDuration={6000} 
        onClose={() => setErrorAlert(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setErrorAlert(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorAlert}
        </Alert>
      </Snackbar>
    </Box>
  );
}
