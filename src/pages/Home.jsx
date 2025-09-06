import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditStatusDialog from "../components/EditStatusDialog.jsx";

const ORDER_STATUSES = [
  { value: 3, label: "Pickup Started" },
  { value: 0, label: "In Progress" },
  { value: 1, label: "Completed" },
  { value: 2, label: "Cancelled" },
];

export default function Home() {
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  console.log(rows);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://reappbackend-c4cuaygbgehpdvfm.centralindia-01.azurewebsites.net/OrderRequest?status=${statusFilter}&pageNumber=${
            paginationModel.page + 1
          }&Size=${paginationModel.pageSize}`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setRows(data.data || []);
        setRowCount(data.totalCount || 0);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setRows([]);
        setRowCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, paginationModel.page, paginationModel.pageSize]);

  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleSaveStatus = async (newStatus) => {
    // Update local state immediately for better UX
    setRows((prev) =>
      prev.map((r) =>
        r.orderId === selectedRow.orderId ? { ...r, status: newStatus } : r
      )
    );
    setDialogOpen(false);
    
    // Optionally, you might want to sync with the backend here
    // and refresh the data if needed
  };

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const columns = useMemo(
    () => [
      { field: "orderId", headerName: "Order ID", flex: 0.8, minWidth: 100 },
      // { field: "userId", headerName: "UserId", flex: 0.8, minWidth: 100 },
      // Uncommented the address field in case you need it
    {
  field: "pickupAddress",
  headerName: "Address To Pickup",
  flex: 1.5,
  minWidth: 200,
  valueGetter: (params) => {
    const addr = params;
    console.log(params);
    if (!addr) return "";
    // Use optional chaining to avoid errors
    return `${addr?.street ?? ""}, ${addr?.city ?? ""}, ${addr?.state ?? ""}, ${addr?.pincode ?? ""}`;
  },
},

      {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        minWidth: 120,
       
      },
      { field: "orderAt", headerName: "OrderAt", flex: 1, minWidth: 180 },
      { field: "completedAt", headerName: "CompletedAt", flex: 1, minWidth: 180 },
      { field: "pinCode", headerName: "PinCode", flex: 1, minWidth: 180 },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        minWidth: 140,
        renderCell: (params) => (
          <Button variant="contained" onClick={() => handleOpenDialog(params.row)}>
            Edit Status
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Orders
      </Typography>

      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPaginationModel(prev => ({ ...prev, page: 0 }));
          }}
        >
          {ORDER_STATUSES.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        sx={{
          height: 520,
          background: "white",
          borderRadius: 2,
          p: 2,
          boxShadow: 1,
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.orderId}
          paginationMode="server"
          rowCount={rowCount}
          loading={loading}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Box>

      <EditStatusDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveStatus}
        statuses={ORDER_STATUSES}
        currentStatus={selectedRow?.status ?? 0}
      />
    </Box>
  );
}