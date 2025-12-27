import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { getImageUrl } from "../../../../../utils/api.js";
import PeopleIcon from "@mui/icons-material/People";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { Link as RouterLink } from "react-router-dom";

export default function CardItem({
  _id,
  title,
  subheader,
  images,
  galleryImages,
  description,
  price,
  adults,
  children,
  roomType,
  amenities,
}) {
  const [openGallery, setOpenGallery] = useState(false);

  return (
    <Card
      component={RouterLink}
      to={`/rooms/${_id}`}
      sx={{
        textDecoration: "none",
        color: "inherit",
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        },
      }}
    >
      {/* Ảnh chính */}
      <Box sx={{ position: "relative", width: "100%", height: 180 }}>
        <CardMedia
          component="img"
          image={getImageUrl(images && images.length ? images[0] : null)}
          
          alt={title}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          onClick={(e) => {
            // Prevent the RouterLink navigation so the gallery can open
            e.preventDefault()
            e.stopPropagation()
            if (Array.isArray(galleryImages) && galleryImages.length > 0) {
              setOpenGallery(true);
            }
          }}
          style={{ cursor: galleryImages?.length ? "pointer" : "default" }}
        />

        {subheader && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              bgcolor: "rgba(0,0,0,0.65)",
              color: "white",
              px: 1.5,
              py: 0.4,
              borderRadius: 1,
              fontSize: 13,
            }}
          >
            {subheader}
          </Box>
        )}
      </Box>

      {/* Nội dung */}
      <CardContent
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#0066ff", fontWeight: 700 }}>
            {price ? price.toLocaleString() : 0} đ
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontSize: 14 }}
        >
          {roomType}
        </Typography>

        {/* Người lớn & trẻ em */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PeopleIcon fontSize="small" sx={{ color: "gray" }} />
            <Typography variant="body2">{adults} người lớn</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ChildCareIcon fontSize="small" sx={{ color: "gray" }} />
            <Typography variant="body2">{children} trẻ em</Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontSize: 13 }}
        >
          {description}
        </Typography>

        <Typography variant="body2" sx={{ fontWeight: 600, mt: 1 }}>
          Tiện nghi:
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {amenities?.map((item, i) => (
            <Chip
              key={i}
              label={item}
              size="small"
              variant="outlined"
              sx={{ fontSize: 12 }}
            />
          ))}
        </Box>
      </CardContent>

      {/* Modal gallery */}
      <Dialog
        open={openGallery}
        onClose={() => setOpenGallery(false)}
        maxWidth="md"
      >
        <DialogContent sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {galleryImages?.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={getImageUrl(img)}
              sx={{
                width: 200,
                height: 150,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
          ))}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
