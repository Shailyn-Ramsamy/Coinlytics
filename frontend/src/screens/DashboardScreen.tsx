import { Container, Button, IconButton, Typography } from "@mui/material";
import { fetchLatestCryptoNews } from "../external_api/cryptopanic";

function DashboardScreen() {

  const getCryptoNews = async () => {
        try {

            const res = await fetchLatestCryptoNews();
            console.log('Logged in user:', res);
        } catch (error) {
            console.error('fetch error:', error);
        }
    };
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return (
    <Container>
      <h1>Welcome {userInfo.name}</h1>
      <Button variant="contained" color="primary" onClick={getCryptoNews}>
        fetch news
      </Button>
    </Container>
  );
}

export default DashboardScreen;
