import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ChildCareIcon from "@mui/icons-material/ChildCare";

export default function RoomInfo({ description, adults, children, amenities = [] }) {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Số lượng khách */}
      <Box sx={{ display: "flex", gap: 4, mb: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PeopleIcon sx={{ color: "gray" }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {adults} người lớn
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ChildCareIcon sx={{ color: "gray" }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {children} trẻ em
          </Typography>
        </Box>
      </Box>

      {/* Mô tả phòng */}
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, lineHeight: 1.6 }}>
        {description}
      </Typography>

      {/* Tiện nghi */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Tiện nghi:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {amenities.map((item, idx) => (
          <Chip
            key={idx}
            label={item}
            size="small"
            sx={{
              fontSize: 12,
              borderRadius: 1,
              px: 1,
              bgcolor: "#f1f8ff",
              color: "primary.main",
              boxShadow: 0,
            }}
          />
        ))}
      </Box>
    </Box>
  );
} 
