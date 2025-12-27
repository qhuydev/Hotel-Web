import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Badge, CircularProgress } from '@mui/material'
import messagesApi from '../../../api/messagesApi.js'
import { useAuthStore } from '../../../stores'

export default function AdminConversations() {
  const { user } = useAuthStore()
  const [convs, setConvs] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchConvs = async () => {
    setLoading(true)
    try {
      const res = await messagesApi.getConversations()
      setConvs(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!user?.isAdmin) return
    fetchConvs()
  }, [user])

  if (!user?.isAdmin) return <Container sx={{ py: 4 }}><Typography>Forbidden</Typography></Container>

  if (loading) return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Conversations</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Last message</TableCell>
              <TableCell>Unread</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {convs.map(c => (
              <TableRow key={c.user._id}>
                <TableCell>{c.user.displayName || c.user.email}</TableCell>
                <TableCell>{c.lastMessage?.content || ''}</TableCell>
                <TableCell>{c.unreadCount || 0}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => {
                    const friend = { id: c.user._id, displayName: c.user.displayName, email: c.user.email }
                    window.dispatchEvent(new CustomEvent('openChat', { detail: { friend } }))
                  }}>Open</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}