import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function BookingForm({ roomId, price, initial = {}, onSubmit, submitting }) {
  const [guestName, setGuestName] = useState(initial.guestName || "");
  const [email, setEmail] = useState(initial.email || "");
  const [checkIn, setCheckIn] = useState(initial.checkIn || "");
  const [checkOut, setCheckOut] = useState(initial.checkOut || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !email || !checkIn || !checkOut) return;
    onSubmit({ roomId, roomTitle: initial.roomTitle, guestName, email, checkIn, checkOut, price });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        maxWidth: 450,
        mx: "auto",
        px: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, textAlign: "center", fontWeight: 600 }}>
        Thông tin khách hàng
      </Typography>

      <TextField
        label="Tên khách"
        variant="outlined"
        fullWidth
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        required
      />

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
        <TextField
          type="date"
          label="Ngày nhận phòng"
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
        />
        <TextField
          type="date"
          label="Ngày trả phòng"
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </Box>

      <Button
        type="submit"
        disabled={submitting}
        variant="contained"
        color="primary"
        size="large"
        sx={{
          py: 1.5,
          fontWeight: 600,
          textTransform: "none",
          "&:hover": { backgroundColor: "#1565c0" },
        }}
      >
        {submitting ? "Đang đặt..." : `Đặt phòng (${price?.toLocaleString() || 0} đ)`}
      </Button>
    </Box>
  );
}
