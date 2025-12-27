import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axiosClient from "../../../api/axiosClient.js";
import { getImageUrl } from "../../utils/api.js";
import { useAuthStore } from "../../../stores";
import bookingsApi from "../../../api/bookingsApi.js";
import BookingForm from "./components/BookingForm.jsx";

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [_failedImages, setFailedImages] = useState({});
  const [openGallery, setOpenGallery] = useState(false);

  // Booking state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [bookingInitial, _setBookingInitial] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);

    (async () => {
      try {
        const res = await axiosClient.get(`/rooms/${id}`);
        if (!cancelled) setRoom(res?.data ?? res);
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setFetchError(
            err.response?.data?.message || err.message || "Fetch failed"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (loading)
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải dữ liệu...</Typography>
      </Container>
    );

  if (fetchError)
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{fetchError}</Alert>
      </Container>
    );

  return (
    <Container sx={{ py: 5 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {room.title}
        </Typography>
        <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 500 }}>
          {room.price.toLocaleString()} đ - {room.roomType}
        </Typography>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        {/* Left: Main Image */}
        <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Box sx={{ width: '100%', maxWidth: 720 }}>
            <Box
              component="img"
              src={getImageUrl(room.images && room.images.length ? room.images[0] : null)}
              alt={room.title}
              onError={() => setFailedImages((s) => ({ ...s, ['main']: true }))}
              onClick={() => setOpenGallery(true)}
              sx={{
                width: '100%',
                height: 420,
                objectFit: 'cover',
                borderRadius: 2,
                cursor: room.images?.length ? 'pointer' : 'default',
                boxShadow: 3
              }}
            />

            {/* Gallery dialog */}
            <Dialog open={openGallery} onClose={() => setOpenGallery(false)} maxWidth="lg" fullWidth>
              <DialogContent sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {(room.images || []).map((img, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={getImageUrl(img)}
                    sx={{ width: 320, height: 220, objectFit: 'cover', borderRadius: 1 }}
                  />
                ))}
              </DialogContent>
            </Dialog>

            {/* Short description */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {room.description}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                👤 Người lớn: {room.adults} | 🧒 Trẻ em: {room.children}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tiện nghi:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {room.amenities?.map((item, idx) => (
                  <Chip key={idx} label={item} size="small" sx={{ fontSize: 12, bgcolor: '#e3f2fd', color: 'primary.main' }} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right: Booking card (inline) */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            textAlign: { xs: 'center', lg: 'left' },
            position: { lg: 'sticky' },
            top: { lg: 100 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 380, borderRadius: 2, boxShadow: 2, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
              Đặt phòng - {room.price?.toLocaleString()} đ
            </Typography>

            {/* Use the BookingForm inline */}
            {!bookingConfirmation ? (
              <BookingForm
                roomId={room._id}
                price={room.price}
                initial={{ roomId: room._id, roomTitle: room.title, checkIn: '', checkOut: '', guestName: user?.displayName || '', email: user?.email || '' }}
                submitting={bookingSubmitting}
                onSubmit={async (data) => {
                  try {
                    setBookingSubmitting(true)
                    const res = await bookingsApi.create(data)
                    setBookingConfirmation(res.data)
                    // open chat with admin automatically when booking created? no - only on confirm
                  } catch (err) {
                    console.error(err)
                    alert(err.response?.data?.message || err.message || 'Booking failed')
                  } finally {
                    setBookingSubmitting(false)
                  }
                }}
              />
            ) : (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6">Đặt phòng thành công!</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Mã đặt phòng: {bookingConfirmation._id}</Typography>
                <Typography variant="body2">Tên: {bookingConfirmation.guestName}</Typography>
                <Typography variant="body2">Email: {bookingConfirmation.email}</Typography>
                <Typography variant="body2">Phòng: {bookingConfirmation.roomTitle}</Typography>
                <Typography variant="body2">Thời gian: {new Date(bookingConfirmation.checkIn).toLocaleDateString()} - {new Date(bookingConfirmation.checkOut).toLocaleDateString()}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" onClick={() => {
                    // open chat with admin to start conversation about this booking
                    const friend = {}
                    window.dispatchEvent(new CustomEvent('openChat', { detail: { friend } }))
                  }}>Nhắn tin</Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Booking Dialog */}
      <Dialog
        open={bookingOpen}
        onClose={() => {
          setBookingOpen(false);
          setBookingConfirmation(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đặt phòng - {bookingInitial.roomTitle}</DialogTitle>
        <DialogContent>
          {!bookingConfirmation ? (
            <BookingForm
              roomId={bookingInitial.roomId}
              price={bookingInitial.price}
              initial={bookingInitial}
              submitting={bookingSubmitting}
              onSubmit={async (data) => {
                try {
                  setBookingSubmitting(true);
                  const res = await bookingsApi.create(data);
                  setBookingConfirmation(res.data);
                } catch (err) {
                  console.error(err);
                  alert(
                    err.response?.data?.message ||
                      err.message ||
                      "Booking failed"
                  );
                } finally {
                  setBookingSubmitting(false);
                }
              }}
            />
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6">Đặt phòng thành công!</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Mã đặt phòng: {bookingConfirmation._id}
              </Typography>
              <Typography variant="body2">
                Tên: {bookingConfirmation.guestName}
              </Typography>
              <Typography variant="body2">
                Email: {bookingConfirmation.email}
              </Typography>
              <Typography variant="body2">
                Phòng: {bookingConfirmation.roomTitle}
              </Typography>
              <Typography variant="body2">
                Thời gian:{" "}
                {new Date(bookingConfirmation.checkIn).toLocaleDateString()} -{" "}
                {new Date(bookingConfirmation.checkOut).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {bookingConfirmation && (
            <Button onClick={() => {
              // open chat with admin (ChatWidget will default to admin when no friend provided)
              window.dispatchEvent(new CustomEvent('openChat', { detail: { } }))
              setBookingOpen(false)
            }} variant="contained">Nhắn tin</Button>
          )}

          <Button
            onClick={() => {
              setBookingOpen(false);
              setBookingConfirmation(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
