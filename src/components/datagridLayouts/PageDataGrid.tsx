import {
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AddressData } from './addressDatagrid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { delApiData } from '../../utils/services';
import { useState } from 'react';

export interface RawData {
  id: number;
  name: string;
  position: string;
  organization: string;
  address: AddressData[];
}

function PageDataGrid({
  rows,
  onDataChange,
}: {
  rows: RawData[];
  onDataChange?: () => void; // Optional callback to refresh parent data
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleDeleteClick = (id: number) => {
    setIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (idToDelete === null) return;

    try {
      await delApiData(String(idToDelete));
      setAlert({
        open: true,
        message: 'Employee deleted successfully!',
        severity: 'success',
      });

      // Call the callback if provided to refresh data in parent component
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setAlert({
        open: true,
        message: 'Failed to delete employee',
        severity: 'error',
      });
    }

    setDeleteDialogOpen(false);
    setIdToDelete(null);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const columns: GridColDef<{
    id: number;
    name: string;
    position: string;
    organization: string;
  }>[] = [
    { field: 'id', flex: 1 },
    {
      field: 'name',
      headerName: 'Name',
      flex: 2,
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1,
    },
    {
      field: 'organization',
      headerName: 'Organization',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box className="flex justify-center gap-1 align-middle">
            <Link to={`/view/${params.id}`}>
              <IconButton color="success">
                <VisibilityIcon />
              </IconButton>
            </Link>
            <Link to={`/update/${params.id}`}>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(Number(params.id));
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box>
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
        pageSizeOptions={[3, 5, 10, 25, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employee? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert for feedback */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PageDataGrid;
