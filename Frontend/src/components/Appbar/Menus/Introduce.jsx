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
import InfoIcon from '@mui/icons-material/Info'
import ArticleIcon from '@mui/icons-material/Article'
import GavelIcon from '@mui/icons-material/Gavel'
import { useNavigate } from 'react-router-dom'

function Introduce() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const navigate = useNavigate()

  const handleToggle = () => setOpen((prev) => !prev)
  const handleClose = (event) => { if (anchorRef.current && anchorRef.current.contains(event.target)) return; setOpen(false) }
  function handleListKeyDown(event) { if (event.key === 'Tab' || event.key === 'Escape') setOpen(false) }

  return (
    <Box>
      <Button ref={anchorRef} id="composition-button" aria-controls={open ? 'composition-menu' : undefined} aria-expanded={open ? 'true' : undefined} aria-haspopup="true" onClick={handleToggle} sx={{ textTransform: 'none', fontSize: '18px', color: 'black' }}>
        Giới thiệu
      </Button>

      <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                  <MenuItem onClick={() => { navigate('/about'); handleClose(new Event('click')) }}>
                    <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Về chúng tôi" />
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/policies'); handleClose(new Event('click')) }}>
                    <ListItemIcon><GavelIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Chính sách" />
                  </MenuItem>

                  <MenuItem onClick={() => { navigate('/news'); handleClose(new Event('click')) }}>
                    <ListItemIcon><ArticleIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Tin tức & Sự kiện" />
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

export default Introduce