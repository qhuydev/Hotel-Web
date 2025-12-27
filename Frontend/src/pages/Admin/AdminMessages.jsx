import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, CircularProgress } from '@mui/material'
import messagesApi from '../../../api/messagesApi.js'
import { useAuthStore } from '../../../stores'

export default function AdminMessages() {
  const { user } = useAuthStore()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', trigger: '', subject: '', body: '', enabled: true })

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const res = await messagesApi.getTemplates()
      setTemplates(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!user?.isAdmin) return
    fetchTemplates()
  }, [user])

  if (!user?.isAdmin) return <Container sx={{ py: 4 }}><Typography>Forbidden</Typography></Container>

  if (loading) return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Messages / Templates</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setForm({ name: '', trigger: '', subject: '', body: '', enabled: true }); setOpen(true) }}>Create template</Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Trigger</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Enabled</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map(t => (
              <TableRow key={t._id}>
                <TableCell>{t.trigger}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.subject}</TableCell>
                <TableCell>
                  <Switch checked={!!t.enabled} onChange={async (e) => {
                    try {
                      await messagesApi.updateTemplate(t._id, { enabled: e.target.checked })
                      fetchTemplates()
                    } catch (err) { alert(err.response?.data?.message || err.message) }
                  }} />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => { setForm({ ...t }); setOpen(true) }}>Edit</Button>
                  <Button size="small" color="error" onClick={async () => { if (!confirm('Delete template?')) return; try { await messagesApi.deleteTemplate(t._id); fetchTemplates(); } catch (err) { alert(err.response?.data?.message || err.message) } }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{form._id ? 'Edit template' : 'Create template'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Trigger (e.g. booking_created)" value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })} />
          <TextField label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <TextField label="Body (HTML allowed)" value={form.body} multiline minRows={4} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <div>
            Enabled: <Switch checked={!!form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              if (form._id) {
                await messagesApi.updateTemplate(form._id, form)
              } else {
                await messagesApi.createTemplate(form)
              }
              setOpen(false)
              fetchTemplates()
            } catch (err) { alert(err.response?.data?.message || err.message) }
          }} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}