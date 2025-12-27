import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Box, Tooltip, Stack, Snackbar, Alert } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import roomsApi from '../../../api/roomsApi.js'
import bookingsApi from '../../../api/bookingsApi.js'
import { useAuthStore } from '../../../stores'

export default function AdminRooms() {
  const { user } = useAuthStore()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [bookingCounts, setBookingCounts] = useState({})

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  // include adults, children, roomType, amenities (as comma-separated string for UI), and premiumInfo
  const [form, setForm] = useState({ title: '', price: 0, description: '', roomType: '', adults: 2, children: 0, amenities: '', premiumInfo: '' })

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    if (!user?.isAdmin) return
    fetchRooms()
  }, [user])

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const res = await roomsApi.list()
      const data = res.data ?? res
      setRooms(data)
      try {
        const countsRes = await bookingsApi.counts()
        setBookingCounts(countsRes.data || {})
      } catch (countErr) {
        console.warn('Failed to fetch booking counts', countErr)
        setBookingCounts({})
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  const [files, setFiles] = useState([])
  const [premiumFiles, setPremiumFiles] = useState([])

  const handleOpenCreate = () => {
    setEditing(null)
    setForm({ title: '', price: 0, description: '', roomType: '', adults: 2, children: 0, amenities: '', premiumInfo: '' })
    setFiles([])
    setPremiumFiles([])
    setDialogOpen(true)
  }

  const handleOpenEdit = (r) => {
    setEditing(r)
    setForm({
      title: r.title,
      price: r.price,
      description: r.description,
      roomType: r.roomType || '',
      adults: typeof r.adults !== 'undefined' ? r.adults : 2,
      children: typeof r.children !== 'undefined' ? r.children : 0,
      amenities: Array.isArray(r.amenities) ? r.amenities.join(', ') : (r.amenities || ''),
      premiumInfo: r.premiumInfo || ''
    })
    // keep existing images but allow adding more
    setFiles([])
    setPremiumFiles([])
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      // prepare amenities as an array from comma-separated UI
      const amenitiesArray = typeof form.amenities === 'string' ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : (form.amenities || [])

      if (files.length > 0 || premiumFiles.length > 0) {
        const data = new FormData()
        data.append('title', form.title)
        data.append('price', String(form.price))
        data.append('description', form.description)
        data.append('roomType', form.roomType || '')
        data.append('adults', String(form.adults || 0))
        data.append('children', String(form.children || 0))
        data.append('premiumInfo', form.premiumInfo || '')
        data.append('amenities', JSON.stringify(amenitiesArray))
        // append files
        files.forEach((f) => data.append('images', f))
        premiumFiles.forEach((f) => data.append('premiumImages', f))

        if (editing) {
          await roomsApi.update(editing._id, data)
        } else {
          await roomsApi.create(data)
        }
      } else {
        // send JSON payload; ensure amenities is an array and numeric fields are correct
        const payload = {
          ...form,
          amenities: amenitiesArray,
          adults: Number(form.adults || 0),
          children: Number(form.children || 0),
          price: Number(form.price || 0)
        }
        if (editing) {
          await roomsApi.update(editing._id, payload)
        } else {
          await roomsApi.create(payload)
        }
      }

      setDialogOpen(false)
      fetchRooms()
      setSnackbar({ open: true, message: editing ? 'Updated room' : 'Created room', severity: 'success' })
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || err.message, severity: 'error' })
    }
  }

  const openDelete = (id) => {
    setSelectedRoom(id)
    setDeleteOpen(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!selectedRoom) return
    try {
      await roomsApi.remove(selectedRoom)
      setSnackbar({ open: true, message: 'Đã xóa phòng', severity: 'success' })
      fetchRooms()
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || err.message, severity: 'error' })
    } finally {
      setDeleteOpen(false)
      setSelectedRoom(null)
    }
  }

  if (!user?.isAdmin) return <Container sx={{ py: 4 }}><Typography>Forbidden</Typography></Container>

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Quản lý phòng</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>Tạo phòng mới</Button>
      </Box>

      {loading ? (
        <Typography>Đang tải danh sách phòng...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Adults</TableCell>
                <TableCell>Children</TableCell>
                <TableCell>Amenities</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Bookings</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map(r => (
                <TableRow key={r._id}>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.price?.toLocaleString()}</TableCell>
                  <TableCell>{r.adults ?? '-'}</TableCell>
                  <TableCell>{r.children ?? '-'}</TableCell>
                  <TableCell>{(r.amenities || []).join ? (r.amenities || []).join(', ') : (r.amenities || '')}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{bookingCounts[r._id] || 0}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={1} sx={{ whiteSpace: 'nowrap', overflowX: 'auto' }} alignItems="center">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenEdit(r)} size="small" aria-label={`edit-${r._id}`}><EditIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title={(bookingCounts[r._id] || 0) > 0 ? 'Không thể xóa: có booking' : 'Delete'}>
                        <span>
                          <IconButton onClick={() => openDelete(r._id)} disabled={(bookingCounts[r._id] || 0) > 0} size="small" aria-label={`delete-${r._id}`}><DeleteIcon fontSize="small" /></IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {rooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">Chưa có phòng nào</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editing ? 'Chỉnh sửa phòng' : 'Tạo phòng'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 500 }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))} />
          <TextField label="Price" type="number" value={form.price} onChange={(e) => setForm(s => ({ ...s, price: Number(e.target.value) }))} />
          <TextField label="Room type" value={form.roomType} onChange={(e) => setForm(s => ({ ...s, roomType: e.target.value }))} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField label="Adults" type="number" value={form.adults} onChange={(e) => setForm(s => ({ ...s, adults: Number(e.target.value) }))} />
            <TextField label="Children" type="number" value={form.children} onChange={(e) => setForm(s => ({ ...s, children: Number(e.target.value) }))} />
          </Box>
          <TextField label="Amenities (comma separated)" helperText="Ví dụ: WiFi,Air Conditioning,Mini Bar" value={form.amenities} onChange={(e) => setForm(s => ({ ...s, amenities: e.target.value }))} />
          <TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm(s => ({ ...s, description: e.target.value }))} />
          <TextField label="Premium info" multiline rows={2} value={form.premiumInfo} onChange={(e) => setForm(s => ({ ...s, premiumInfo: e.target.value }))} />

          <Box>
            <Typography variant="subtitle2">Ảnh phòng (tối đa 8)</Typography>
            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {files.map((f, i) => (
                <Box key={i} component="img" src={URL.createObjectURL(f)} sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }} />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2">Ảnh Premium (tối đa 4)</Typography>
            <input type="file" multiple accept="image/*" onChange={(e) => setPremiumFiles(Array.from(e.target.files))} />
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              {premiumFiles.map((f, i) => (
                <Box key={i} component="img" src={URL.createObjectURL(f)} sx={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 1 }} />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Xóa phòng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Xác nhận xóa phòng này? Hành động không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirmed}>Xóa</Button>
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