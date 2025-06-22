import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Link,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

type Props = {
  data?: any[];
  loading?: boolean;
};

export default function NewsGrid({ data = [], loading = false }: Props) {
  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : data.length === 0 ? (
        <Typography variant="body1">No news available.</Typography>
      ) : (
        data.map((item, index) => (
          <Card
            key={item.id || index}
            sx={{ display: "flex", mb: 2, borderRadius: 2 }}
          >
            {item.image && (
              <CardMedia
                component="img"
                sx={{ width: 160, objectFit: "cover" }}
                image={item.image}
                alt={item.headline}
              />
            )}
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.headline}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.summary}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                  Source: {item.source}
                </Typography>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  Read Full Article →
                </Link>
              </CardContent>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
}
