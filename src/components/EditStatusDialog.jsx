import React, { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material'

export default function EditStatusDialog({ open, onClose, onSave, statuses, currentStatus }) {
  const [status, setStatus] = useState(currentStatus || 'InProgress')

  useEffect(() => {
    setStatus(currentStatus || 'InProgress')
  }, [currentStatus])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Order Status</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Status"
          margin="normal"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statuses.map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(status)}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
