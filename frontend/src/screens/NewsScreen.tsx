import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Typography,
  Box,
} from "@mui/material";
import NewsGrid from "../components/NewsGrid";
import { fetchLatestStockNews } from "../external_api/finnhub";

const categoryOptions = [
  { label: "General", value: "general" },
  { label: "Merger", value: "merger" },
  { label: "Forex", value: "forex" },
  { label: "Crypto", value: "crypto" },
];

function NewsScreen() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const getNews = async (category?: string | null) => {
    try {
      setLoading(true);
      const res = await fetchLatestStockNews(category);
      setNews(res);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
    setLoading(false); 
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    getNews(selectedCategory);
  }, [selectedCategory]);

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        mt={4}
      >
        <Typography variant="h4">Stock Market News</Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {categoryOptions.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "contained" : "outlined"}
              onClick={() =>
                setSelectedCategory((prev) =>
                  prev === cat.value ? null : cat.value
                )
              }
            >
              {cat.label}
            </Button>
          ))}
        </Box>
      </Box>
      <NewsGrid data={news} loading={loading}/>
    </Container>
  );
}

export default NewsScreen;
