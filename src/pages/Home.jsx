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
import OrderDetailsDialog from "../components/OrderDetailsDialog.jsx";
import InfoIcon from '@mui/icons-material/Info';

const ORDER_STATUSES = [
   "PickupStart", 
 "InProgress" , "Completed" ,
"Cancelled" ,
];

export default function Home() {
  const [rows, setRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState("InProgress");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

// For storing fetched user details
const [userDetails, setUserDetails] = useState(null);

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
      const url = `https://reappbackend-c4cuaygbgehpdvfm.centralindia-01.azurewebsites.net/OrderRequest?status=${statusFilter}&pageNumber=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`;
      
      console.log("Fetching:", url);

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      console.log("API Response:", data);

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
const handleRowClick = async (row) => {
  setSelectedRow(row);  // store selected order
  setDetailsOpen(true); // open the dialog

  try {
    const response = await fetch(
      `https://reappbackend-c4cuaygbgehpdvfm.centralindia-01.azurewebsites.net/api/User/getuser?userId=${row.userId}`
    );

    if (!response.ok) throw new Error("Failed to fetch user");

    const user = await response.json();
    setUserDetails(user); // store user data
  } catch (error) {
    console.error("Error fetching user details:", error);
    setUserDetails(null);
  }
};


  const handleOpenDialog = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

const handleSaveStatus = async (newStatus) => {
  try {
    // Update UI immediately (optimistic update)
    setRows((prev) =>
      prev.map((r) =>
        r.orderId === selectedRow.orderId ? { ...r, status: newStatus } : r
      )
    );
    setDialogOpen(false);

    // 🔥 Call backend API to persist status
    const response = await fetch(
      `https://reappbackend-c4cuaygbgehpdvfm.centralindia-01.azurewebsites.net/OrderRequest/update-status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedRow.orderId,
          status: newStatus,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    const data = await response.json();

  } catch (error) {
    console.error("❌ Error updating status:", error);
    alert("Failed to update status. Please try again.");
  }
};


  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const columns = useMemo(
    () => [
      { field: "orderId", headerName: "Order ID", flex: 0.8, minWidth: 100 },
      // { field: "userId", headerName: "UserId", flex: 0.8, minWidth: 100 },
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
},{
  field: "items",
  headerName: "Item",
  flex: 1,
  minWidth: 150,
  valueGetter: (params) => {
    const items = params;
    if (!items || items.length === 0) return "No materials listed"

    return items
      .map((i) => {
        const subs = i.subItems?.map((s) => s.name).join(", ");
        return subs ? `${i.name} (${subs})` : i.name;
      })
      .join(", ");
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
      field: "user",
      headerName: "User",
      sortable: false,
      filterable: false,
      minWidth: 80,
      renderCell: (params) => (
        <Button
          onClick={() => handleRowClick(params.row)}
          size="small"
          variant="outlined"
        >
          <InfoIcon />
        </Button>
      ),
    },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        minWidth: 140,
        renderCell: (params) => 
           params.row.status === "Cancelled" ? null : ( // 👈 hide button if cancelled
      <Button
        variant="contained"
        onClick={() => handleOpenDialog(params.row)}
      >
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
    setStatusFilter(e.target.value);   // ✅ use value, not label
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }}
>
  {ORDER_STATUSES.map((s) => (
    <MenuItem key={s} value={s}>
      {s}
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
  currentStatus={selectedRow?.status ?? "InProgress"}  
/>
<OrderDetailsDialog
  open={detailsOpen}
  onClose={() => setDetailsOpen(false)}
  order={selectedRow}
  user={userDetails}
/>


    </Box>
  );
}