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
import PoolIcon from '@mui/icons-material/Pool'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ViewListIcon from '@mui/icons-material/ViewList'
import { useNavigate } from 'react-router-dom'

function Facilities() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const navigate = useNavigate()

  const handleToggle = () => setOpen((prev) => !prev)
  const handleClose = (event) => { if (anchorRef.current && anchorRef.current.contains(event.target)) return; setOpen(false) }
  function handleListKeyDown(event) { if (event.key === 'Tab' || event.key === 'Escape') setOpen(false) }

  return (
    <Box>
      <Button ref={anchorRef} id="composition-button" aria-controls={open ? 'composition-menu' : undefined} aria-expanded={open ? 'true' : undefined} aria-haspopup="true" onClick={handleToggle} sx={{ textTransform: 'none', fontSize: '18px', color: 'black' }}>
        Tiện nghi
      </Button>

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={() => { navigate('/facilities#pool'); handleClose(new Event('click')) }}>
                    <ListItemIcon><PoolIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Hồ bơi" />
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/facilities#gym'); handleClose(new Event('click')) }}>
                    <ListItemIcon><FitnessCenterIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Phòng tập" />
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/facilities#restaurant'); handleClose(new Event('click')) }}>
                    <ListItemIcon><RestaurantIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Nhà hàng" />
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/facilities'); handleClose(new Event('click')) }}>
                    <ListItemIcon><ViewListIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Tất cả tiện nghi" />
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

export default Facilities