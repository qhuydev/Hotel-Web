import React, { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import BookingForm from "./BookingForm.jsx";
import bookingsApi from "../../../../api/bookingsApi.js";

export default function BookingCard({ room }) {
  const price = room?.price || 0;
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(room?.adults || 1);
  const [children, setChildren] = useState(room?.children || 0);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const s = new Date(checkIn);
    const e = new Date(checkOut);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const total = nights * price;

  const openBookingDialog = () => {
    setOpen(true);
    setConfirmation(null);
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3, maxWidth: 420, mx: { xs: "auto", lg: 0 } }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1, fontWeight: 700 }}>
          {room?.title}
        </Typography>

        <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 800, mb: 2 }}>
          {price?.toLocaleString()} đ <Typography component="span" sx={{ fontSize: 14, color: "text.secondary" }}> / đêm</Typography>
        </Typography>

        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }} onSubmit={(e)=>{e.preventDefault(); openBookingDialog();}}>
          <TextField
            label="Ngày nhận"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <TextField
            label="Ngày trả"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="adults-label">Người lớn</InputLabel>
              <Select labelId="adults-label" value={adults} label="Người lớn" onChange={(e) => setAdults(e.target.value)}>
                {[1,2,3,4,5].map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="children-label">Trẻ em</InputLabel>
              <Select labelId="children-label" value={children} label="Trẻ em" onChange={(e) => setChildren(e.target.value)}>
                {[0,1,2,3,4].map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>{nights} đêm</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{total?.toLocaleString()} đ</Typography>
          </Box>

          <Button type="submit" variant="contained" color="primary" size="large" sx={{ py: 1.5, mt: 1, fontWeight: 700 }}>
            Đặt phòng ngay
          </Button>

          <Typography variant="caption" sx={{ mt: 1, display: "block", color: "text.secondary" }}>
            Miễn phí hủy trong 24h · Thanh toán tại khách sạn
          </Typography>
        </Box>
      </CardContent>

      <Dialog open={open} onClose={() => { setOpen(false); setConfirmation(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>Đặt phòng - {room?.title}</DialogTitle>
        <DialogContent>
          {!confirmation ? (
            <BookingForm
              roomId={room?._id}
              price={price}
              initial={{ roomTitle: room?.title, checkIn, checkOut, guestName: "", email: "" }}
              submitting={submitting}
              onSubmit={async (data) => {
                try {
                  setSubmitting(true);
                  const res = await bookingsApi.create(data);
                  setConfirmation(res.data);
                } catch (err) {
                  console.error(err);
                  alert(err.response?.data?.message || err.message || "Booking failed");
                } finally {
                  setSubmitting(false);
                }
              }}
            />
          ) : (
            <Box sx={{ py: 2 }}>
              <Alert severity="success">Đặt phòng thành công!</Alert>
              <Typography variant="body2" sx={{ mt: 1 }}>Mã: {confirmation._id}</Typography>
              <Typography variant="body2">Phòng: {confirmation.roomTitle}</Typography>
              <Typography variant="body2">Tên: {confirmation.guestName}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setConfirmation(null); }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
