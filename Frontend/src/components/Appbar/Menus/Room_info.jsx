import React, { useEffect, useState, useRef } from 'react'
import Box  from '@mui/material/Box'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import CircularProgress from '@mui/material/CircularProgress'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useAuthStore } from '../../../../stores'
import { useNavigate } from 'react-router-dom'
import bookingsApi from '../../../../api/bookingsApi.js'

function Room_info() {
    const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  useEffect(() => {
    let cancelled = false
    if (!open) return

    // If not logged in, nothing to fetch
    if (!user) {
      setBookings([])
      return
    }

    setLoading(true)
    setError(null)

    bookingsApi.getMy()
      .then(res => {
        if (cancelled) return
        const data = res.data ?? res
        setBookings(data)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.response?.data?.message || err.message || 'Lấy thông tin đặt phòng thất bại')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [open, user])

  const handleGotoRoom = (roomId) => {
    setOpen(false)
    if (roomId) navigate(`/rooms/${roomId}`)
  }

  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString() } catch { return '-' }
  }

  return (
    <Box>
   <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          sx={{
            textTransform: 'none',
            fontSize: '18px',
            color: 'black'
          }}
        >
          Thông tin đặt phòng
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-start' ? 'left top' : 'left bottom',
              }}
            >
              <Paper sx={{ minWidth: 300 }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">Thông tin đặt phòng</Typography>
                    </Box>
                    <Divider />

                    {loading && (
                      <MenuItem>
                        <ListItemText primary={<CircularProgress size={20} />} />
                      </MenuItem>
                    )}

                    {error && (
                      <MenuItem disabled>
                        <ListItemText primary={error} />
                      </MenuItem>
                    )}

                    {!loading && !error && bookings.length === 0 && (
                      <MenuItem disabled>
                        <ListItemText primary={user ? 'Bạn chưa đặt phòng nào' : 'Vui lòng đăng nhập để xem đặt phòng'} />
                      </MenuItem>
                    )}

                    {!loading && !error && bookings.map((b) => (
                      <MenuItem key={b._id} onClick={() => handleGotoRoom(b.roomId)}>
                        <ListItemAvatar>
                          <Avatar sx={{ width: 36, height: 36 }}>{(b.roomTitle || '—').slice(0,1)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={b.roomTitle}
                          secondary={`${formatDate(b.checkIn)} → ${formatDate(b.checkOut)} • ${b.guestName}`}
                        />
                      </MenuItem>
                    ))}

                    <Divider />
                    <MenuItem onClick={() => { handleClose(); navigate('/'); }}>
                      Trang chủ
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    </Box>
  )
}

export default Room_info