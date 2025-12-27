import React from "react";
import { Box, Typography } from "@mui/material";

export default function RoomHeader({ title, price, roomType }) {
  return (
    <Box sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}>
      <Typography variant="h4" fontWeight={800} mb={1}>
        {title}
      </Typography>
      <Typography variant="h6" color="primary" mb={0.5} sx={{ fontWeight: 700 }}>
        {price?.toLocaleString()} đ / đêm
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {roomType}
      </Typography>
    </Box>
  );
} 
