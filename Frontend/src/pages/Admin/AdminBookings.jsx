import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ChatIcon from '@mui/icons-material/Chat'
import DeleteIcon from '@mui/icons-material/Delete'
import bookingsApi from '../../../api/bookingsApi.js'
import { useAuthStore } from '../../../stores'

export default function AdminBookings() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState([])

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    if (!user?.isAdmin) return
    const fetchData = async () => {
      try {
        const res = await bookingsApi.getAll()
        setBookings(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [user])

  const refresh = async () => {
    try {
      const res = await bookingsApi.getAll()
      setBookings(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const openConfirm = (b) => {
    setSelectedBooking(b)
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!selectedBooking) return
    try {
      const resConfirm = await bookingsApi.confirm(selectedBooking._id)
      if (resConfirm.data?.message) {
        setSnackbar({ open: true, message: 'Đã gửi thông báo xác nhận tới khách', severity: 'success' })
        const friend = { id: selectedBooking.user?._id || selectedBooking.user, displayName: selectedBooking.user?.displayName || selectedBooking.user?.email || selectedBooking.email }
        window.dispatchEvent(new CustomEvent('openChat', { detail: { friend } }))
      } else {
        setSnackbar({ open: true, message: 'Đã xác nhận đặt phòng', severity: 'success' })
      }
      await refresh()
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || err.message, severity: 'error' })
    } finally {
      setConfirmOpen(false)
      setSelectedBooking(null)
    }
  }

  const openDelete = (b) => {
    setSelectedBooking(b)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedBooking) return
    try {
      await bookingsApi.remove(selectedBooking._id)
      setSnackbar({ open: true, message: 'Đã xóa đặt phòng', severity: 'success' })
      await refresh()
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || err.message, severity: 'error' })
    } finally {
      setDeleteOpen(false)
      setSelectedBooking(null)
    }
  }

  const handleOpenChat = (b) => {
    const friend = { id: b.user?._id || b.user, displayName: b.user?.displayName || b.user?.email || b.email }
    window.dispatchEvent(new CustomEvent('openChat', { detail: { friend } }))
  }

  if (!user?.isAdmin) return <Container sx={{ py: 4 }}><Typography>Forbidden</Typography></Container>

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Bookings</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Booked By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(b => (
              <TableRow key={b._id}>
                <TableCell>{b._id}</TableCell>
                <TableCell>{b.roomTitle}</TableCell>
                <TableCell>{b.guestName}</TableCell>
                <TableCell>{b.email}</TableCell>
                <TableCell>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                <TableCell>{b.status || 'pending'}</TableCell>
                <TableCell>{b.user?.email || '—'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Stack direction="row" spacing={1} sx={{ whiteSpace: 'nowrap', overflowX: 'auto' }} alignItems="center">
                    {b.status !== 'confirmed' && (
                      <Tooltip title="Confirm booking">
                        <IconButton size="small" color="success" onClick={() => openConfirm(b)}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Nhắn tin">
                      <IconButton size="small" onClick={() => handleOpenChat(b)}>
                        <ChatIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete booking">
                      <IconButton size="small" color="error" onClick={() => openDelete(b)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận đặt phòng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xác nhận đặt phòng <b>{selectedBooking?.roomTitle}</b> cho <b>{selectedBooking?.guestName}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleConfirm}>Xác nhận</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Xóa đặt phòng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Xác nhận xóa đặt phòng <b>{selectedBooking?.roomTitle}</b> - <b>{selectedBooking?.guestName}</b>? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Xóa</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  )
}