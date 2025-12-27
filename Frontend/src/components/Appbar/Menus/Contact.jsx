import React, { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import { useNavigate } from 'react-router-dom'

function Contact() {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const navigate = useNavigate()

  const handleToggle = () => setOpen((prev) => !prev)
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return
    setOpen(false)
  }
  function handleListKeyDown(event) {
    if (event.key === 'Tab' || event.key === 'Escape') setOpen(false)
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
        sx={{ textTransform: 'none', fontSize: '18px', color: 'black' }}
      >
        Liên hệ
      </Button>

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={() => { window.location.href = 'tel:+84123456789'; handleClose(new Event('click')) }}>
                    <ListItemIcon><PhoneIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Gọi: +84 123 456 789" />
                  </MenuItem>

                  <MenuItem onClick={() => { window.location.href = 'mailto:contact@hotel.com'; handleClose(new Event('click')) }}>
                    <ListItemIcon><EmailIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Email: contact@hotel.com" />
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/contact'); handleClose(new Event('click')) }}>
                    <ListItemIcon><ContactPageIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Trang Liên hệ" />
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

export default Contact