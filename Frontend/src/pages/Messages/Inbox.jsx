import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material'
import { useAuthStore } from '../../../stores'
import messagesApi from '../../../api/messagesApi.js'

export default function Inbox() {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (!user) return
    fetch()
  }, [user])

  const fetch = async () => {
    try {
      const res = await messagesApi.getMy()
      setMessages(res.data.items)
    } catch (err) {
      console.error(err)
    }
  }

  if (!user) return <Container sx={{ py: 4 }}><Typography>Unauthorized</Typography></Container>

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Inbox</Typography>
      <Paper>
        <List>
          {messages.length === 0 && <ListItem><ListItemText primary="No messages" /></ListItem>}
          {messages.map(m => (
            <React.Fragment key={m._id}>
              <ListItem alignItems="flex-start" button={true} onClick={async () => {
                try {
                  // If meta.userId exists and current user is admin, open chat with that user
                  if (m.meta?.userId && user?.isAdmin) {
                    const friend = { id: m.meta.userId }
                    window.dispatchEvent(new CustomEvent('openChat', { detail: { friend } }))
                    return
                  }

                  // otherwise, open chat with admin (for the recipient user)
                  const res = await messagesApi.getAdmin()
                  const admin = res.data || res
                  window.dispatchEvent(new CustomEvent('openChat', { detail: { friend: admin } }))
                } catch (err) {
                  console.error('Failed to open chat from inbox', err)
                }
              }}>
                <ListItemText
                  primary={m.subject}
                  secondary={<span dangerouslySetInnerHTML={{ __html: m.body }} />}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  )
}