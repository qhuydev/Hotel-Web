import React, { useState } from "react";
import { Box, CardMedia, Chip } from "@mui/material";
import { getImageUrl } from "../../../utils/api.js";

export default function RoomImages({ images = [] }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={getImageUrl(images[current])}
          alt="Main room"
          sx={{
            width: "100%",
            height: { xs: 300, md: 420 },
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
        <Chip
          label={`${current + 1} / ${images.length}`}
          size="small"
          color="primary"
          sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(255,255,255,0.9)" }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: 1,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "#90caf9", borderRadius: 3 },
        }}
      >
        {images.map((img, idx) => (
          <CardMedia
            key={idx}
            component="img"
            image={getImageUrl(img)}
            alt={`Room thumbnail ${idx + 1}`}
            onClick={() => setCurrent(idx)}
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 45, sm: 60 },
              objectFit: "cover",
              borderRadius: 1,
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": { transform: "scale(1.05)", boxShadow: 3 },
              flexShrink: 0,
              border: idx === current ? "2px solid" : "2px solid transparent",
              borderColor: idx === current ? "primary.main" : "transparent",
            }}
          />
        ))}
      </Box>
    </Box>
  );
} 
