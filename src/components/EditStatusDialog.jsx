import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

export default function EditStatusDialog({
  open,
  onClose,
  onSave,
  statuses,
  currentStatus,
}) {
  console.log("EditStatusDialog props - open:", open, "currentStatus:", currentStatus);
  const [status, setStatus] = useState(currentStatus ?? "");
console.log("Current Status in Dialog:", currentStatus);
  useEffect(() => {
    console.log("Updating status in dialog to:", currentStatus);
    setStatus(currentStatus);
  }, [currentStatus,open]);
  

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
          onChange={(e) => setStatus(e.target.value)} // keep as string
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(status)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
