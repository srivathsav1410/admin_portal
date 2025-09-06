import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from "@mui/material";

export default function OrderDetailsDialog({ open, onClose, order, user }) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Order Details (ID: {order.orderId})</DialogTitle>
      <DialogContent dividers>
        {user && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>User Details</Typography>
            <Typography>Name: {user.userName}</Typography>
            <Typography>Contact: {user.phoneNumber}</Typography>
          </Box>
        )}

        <Divider />

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
