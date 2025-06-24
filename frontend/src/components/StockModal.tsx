import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Button,
  ListItemButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { postStockPurchase, searchStocks } from "../external_api/Twelvedata";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: '90%', sm: '80%', md: 600, lg: 800 },
  maxWidth: 800,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAddStock: (data: { stock_id: number; purchase_date: string; amount_spent: number }) => void;
};


export default function AddStockModal({ open, onClose, onAddStock }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<{
    id: number;
    name: string;
    symbol: string;
  } | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<Dayjs | null>(null);
  const [amountInvested, setAmountInvested] = useState("");
  const [defaultStocks, setDefaultStocks] = useState<
    { id: number; name: string; symbol: string }[]
  >([]);
  const [searchResults, setSearchResults] = useState<
    { id: number; name: string; symbol: string }[]
  >([]);
  const [loadingStocks, setLoadingStocks] = useState(false);

  const clearInputs = () => {
    setSearchTerm("");
    setSelectedStock(null);
    setPurchaseDate(null);
    setAmountInvested("");
    setSearchResults([]);
  };

  const handleClose = () => {
    clearInputs();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedStock || !purchaseDate || !amountInvested) {
        alert("Please complete all fields.");
        return;
    }

    const payload = {
        stock_id: selectedStock.id,
        purchase_date: purchaseDate.format('YYYY-MM-DD'),
        amount_spent: parseFloat(amountInvested),
    };

    console.log("Calling onAddStock with", payload);
    onAddStock?.(payload);
    clearInputs();
    onClose();
    };


  useEffect(() => {
    if (!open) return;
    const fetchDefault = async () => {
      try {
        const stocks = await searchStocks("", 1, 5);
        setDefaultStocks(stocks);
      } catch (err) {
        console.error("Failed to load default stocks", err);
      }
    };
    fetchDefault();
  }, [open]);

  

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchTerm.trim()) return setSearchResults([]);

      try {
        setLoadingStocks(true);
        const results = await searchStocks(searchTerm, 1);
        setSearchResults(results);
      } catch (err) {
        console.error("Failed to fetch stock search", err);
      } finally {
        setLoadingStocks(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);


  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Add Stock Investment</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search stocks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <List sx={{ maxHeight: 300, overflowY: "auto" }}>
              {loadingStocks ? (
                <Typography px={2}>Searching...</Typography>
              ) : searchTerm.trim() ? (
                searchResults.length === 0 ? (
                  <Typography px={2}>No results found</Typography>
                ) : (
                  searchResults.map((stock) => (
                    <React.Fragment key={stock.id}>
                      <ListItemButton
                        selected={selectedStock?.id === stock.id}
                        onClick={() => setSelectedStock(stock)}
                      >
                        <ListItemText
                          primary={stock.name}
                          secondary={stock.symbol}
                        />
                      </ListItemButton>
                      <Divider />
                    </React.Fragment>
                  ))
                )
              ) : (
                defaultStocks.map((stock) => (
                  <React.Fragment key={stock.id}>
                    <ListItemButton
                      selected={selectedStock?.id === stock.id}
                      onClick={() => setSelectedStock(stock)}
                    >
                      <ListItemText
                        primary={stock.name}
                        secondary={stock.symbol}
                      />
                    </ListItemButton>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          </Grid>

          <Grid size={{ xs: 12 }}>
            {selectedStock ? (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Selected: {selectedStock.name} ({selectedStock.symbol})
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Purchase Date"
                    value={purchaseDate}
                    onChange={(newValue) => setPurchaseDate(newValue)}
                    shouldDisableDate={(date) => {
                      const day = date.day();
                      return day === 0 || day === 6; // Disable Sunday (0) and Saturday (6)
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { mb: 2 }
                      }
                    }}
                  />
                </LocalizationProvider>

                <TextField
                  fullWidth
                  type="number"
                  label="Amount Invested ($)"
                  value={amountInvested}
                  onChange={(e) => setAmountInvested(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Submit Investment
                </Button>
              </>
            ) : (
              <Typography>Select a stock to continue</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
