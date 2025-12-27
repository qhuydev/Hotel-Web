import React, { useEffect, useState } from 'react'
import { Box, IconButton, Paper, Typography, List, ListItem, ListItemText, Divider, TextField, Button, Avatar, Badge, CircularProgress } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import messagesApi from '../../../api/messagesApi.js'
import { useAuthStore } from '../../../stores'

export default function ChatWidget() {
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [friend, setFriend] = useState(null)
  const [messages, setMessages] = useState([])
  const [_loading, setLoading] = useState(false)
  const [text, setText] = useState('')

  // listen to external open chat events: { friend: { id, displayName, email } }
  useEffect(() => {
    const handler = (e) => {
      const f = e.detail?.friend
      if (f) {
        setFriend(f)
        setOpen(true)
      }
    }
    window.addEventListener('openChat', handler)
    return () => window.removeEventListener('openChat', handler)
  }, [])

  // when opened, ensure we have a friend (default to admin) and load conversation
  useEffect(() => {
    if (!open || !user) return
    const init = async () => {
      let f = friend
      try {
        if (!f) {
          const res = await messagesApi.getAdmin()
          f = res.data || res
          setFriend(f)
        }
        if (f?._id || f?.id) {
          await loadConversation(f._id || f.id)
          await messagesApi.markRead(f._id || f.id)
        }
      } catch (err) {
        console.error('Failed to init chat', err)
      }
    }
    init()
  }, [open, user, friend])

  const loadConversation = async (otherId) => {
    setLoading(true)
    try {
      const res = await messagesApi.getConversation(otherId)
      // axiosClient returns { success, message, data }
      setMessages(res.data || [])
    } catch (err) {
      console.error(err)
      setMessages([])
    }
    setLoading(false)
  }

  const send = async () => {
    if (!text.trim() || !friend) return
    try {
      const res = await messagesApi.sendMessage({ receiverId: friend._id || friend.id, content: text, messageType: 'TEXT' })
      setText('')
      // append new message (axiosClient returns { success, message, data })
      setMessages(prev => [...prev, res.data])
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const unreadCount = messages.filter(m => m.receiverId && m.receiverId._id === user?._id && !m.isRead).length

  return (
    <Box>
      {open && (
        <Paper elevation={6} sx={{ position: 'fixed', bottom: 80, right: 24, width: 360, maxHeight: '60vh', display: 'flex', flexDirection: 'column', zIndex: 4000 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: '#1976d2' }}>{friend?.displayName?.[0] || user?.displayName?.[0] || 'U'}</Avatar>
              <Typography variant="subtitle1">{friend?.displayName || friend?.email || 'Chat'}</Typography>
            </Box>
            <Button size="small" onClick={() => setOpen(false)}>Close</Button>
          </Box>

          <Box sx={{ overflow: 'auto', p: 1 }}>
            <List>
              {messages.length === 0 && <ListItem><ListItemText primary="No messages yet. Send a message to contact the hotel." /></ListItem>}
              {messages.map(m => {
                const mine = m.senderId && (m.senderId._id ? m.senderId._id === user?._id : m.senderId === user?._id)
                return (
                  <React.Fragment key={m._id || m.id}>
                    <ListItem sx={{ justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                      <Box sx={{ maxWidth: '75%', bgcolor: mine ? '#e6f7ff' : '#f5f5f5', px: 1.5, py: 1, borderRadius: 1 }}>
                        <Typography variant="body2">{m.content || m.body || m.subject}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(m.createdAt || m.created_at).toLocaleString()}</Typography>
                      </Box>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                )
              })}
            </List>
          </Box>

          <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
            <TextField value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message..." fullWidth multiline maxRows={4} />
            <Button variant="contained" onClick={send}>Send</Button>
          </Box>
        </Paper>
      )}

      <Badge badgeContent={unreadCount} color="error">
        <IconButton onClick={async () => {
          // toggle open; if opening, try to jump to the conversation that has unread messages
          setOpen((prev) => {
            const opening = !prev
            if (!opening) return false
            // if admin, try to open first unread conversation
            (async () => {
              try {
                if (user?.isAdmin) {
                  const res = await messagesApi.getConversations()
                  const convs = res.data || []
                  const unreadConv = convs.find(c => c.unreadCount && c.unreadCount > 0)
                  if (unreadConv) {
                    const friend = { id: unreadConv.user._id, displayName: unreadConv.user.displayName, email: unreadConv.user.email }
                    window.dispatchEvent(new CustomEvent('openChat', { detail: { friend } }))
                    return
                  }
                }
                // otherwise open default admin conversation
                const resAdmin = await messagesApi.getAdmin()
                const admin = resAdmin.data || resAdmin
                window.dispatchEvent(new CustomEvent('openChat', { detail: { friend: admin } }))
              } catch (err) {
                console.error('Failed to open default conversation', err)
                setOpen(true)
              }
            })()
            return opening
          })
        }} sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: 4000, bgcolor: 'white', boxShadow: 2 }}>
          <ChatIcon />
        </IconButton>
      </Badge>
    </Box>
  )
}