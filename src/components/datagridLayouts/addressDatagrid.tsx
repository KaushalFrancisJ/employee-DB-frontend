import {
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import EditAddressModal from '../EditAddressModal';

export interface AddressData {
  id: number;
  address: string;
  location: string;
  pin: number;
  contactNo: number;
}

interface AddressDataGridProps {
  rows: AddressData[];
  onEditAddress?: (editedAddress: AddressData) => void;
  onDeleteAddress?: (id: number) => void;
}

function AddressDataGrid({
  rows,
  onEditAddress,
  onDeleteAddress,
}: AddressDataGridProps) {
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const handleEditClick = (address: AddressData) => {
    setSelectedAddress(address);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEditAddress = (editedAddress: AddressData) => {
    if (onEditAddress) {
      onEditAddress(editedAddress);
    }
    setEditModalOpen(false);
  };

  const confirmDelete = () => {
    if (addressToDelete !== null && onDeleteAddress) {
      onDeleteAddress(addressToDelete);
    }
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const columns: GridColDef<AddressData>[] = [
    { field: 'id', flex: 1 },
    {
      field: 'address',
      headerName: 'Address',
      flex: 2,
    },
    {
      field: 'location',
      headerName: 'Location',
      flex: 1,
    },
    {
      field: 'pin',
      headerName: 'Pin',
      flex: 1,
    },
    {
      field: 'contactNo',
      headerName: 'Contact No.',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box className="flex mt-2.5 justify-center gap-1">
          <IconButton
            color="secondary"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box className="h-66.5">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 3,
            },
          },
        }}
        pageSizeOptions={[3]}
        checkboxSelection
        disableRowSelectionOnClick
      />

      {/* Edit Address Modal */}
      {selectedAddress && (
        <EditAddressModal
          address={selectedAddress}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onEditAddress={handleEditAddress}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this address?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddressDataGrid;
