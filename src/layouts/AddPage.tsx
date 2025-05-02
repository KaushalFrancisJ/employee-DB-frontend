import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddressDataGrid, {
  AddressData,
} from '../components/datagridLayouts/addressDatagrid';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate, useParams } from 'react-router-dom';
import { RawData } from '../components/datagridLayouts/PageDataGrid';
import { getApiData, createApiData, updateApiData } from '../utils/services';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { RawDataSchema } from '../utils/employee-schema';
import { useDebounce } from '../hooks/useDebounce';
import AddAddressModal from '../components/AddAddressModal';

const AddPage = ({ operation }: { operation: string }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentData, setCurrentData] = useState<RawData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAddresses, setFilteredAddresses] = useState<AddressData[]>([]);
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [addressId, setAddressId] = useState(100);

  // Add alert state
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Add new address
  const handleAddAddress = (newAddress: AddressData) => {
    // Increment addressId first for the next address
    const nextId = addressId + 1;
    setAddressId(nextId);

    // Close modal
    setOpenModal(false);

    // Add the new address to the addresses state
    setAddresses((prev) => {
      const updatedAddresses = [...prev, newAddress];
      // Update formik value as well to ensure it gets submitted with the form
      formik.setFieldValue('address', updatedAddresses);
      return updatedAddresses;
    });
  };

  // Edit existing address
  const handleEditAddress = (editedAddress: AddressData) => {
    setAddresses((prev) => {
      const updatedAddresses = prev.map((addr) =>
        addr.id === editedAddress.id ? editedAddress : addr,
      );
      // Update formik value
      formik.setFieldValue('address', updatedAddresses);
      return updatedAddresses;
    });
  };

  // Delete address
  const handleDeleteAddress = (addressId: number) => {
    setAddresses((prev) => {
      const updatedAddresses = prev.filter((addr) => addr.id !== addressId);
      // Update formik value
      formik.setFieldValue('address', updatedAddresses);
      return updatedAddresses;
    });
  };

  useEffect(() => {
    return () => {
      console.log('Unmounted');
    };
  }, []);

  // Fetch existing data if id exists
  useEffect(() => {
    if (id) {
      fetchRawData();
    }
  }, [id]);

  const fetchRawData = async () => {
    try {
      const fetchedData: RawData = await getApiData(id);
      setCurrentData(fetchedData);

      // Find max address ID to ensure new addresses have unique IDs
      if (fetchedData.address && fetchedData.address.length > 0) {
        const maxId = Math.max(
          ...fetchedData.address.map((addr) => addr.id || 0),
        );
        setAddressId(maxId + 1);
      }

      setAddresses(fetchedData.address);
      setFilteredAddresses(fetchedData.address);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setAlert({
        open: true,
        message: 'Failed to load employee data',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (currentData?.address) {
      setAddresses(currentData.address);
      setFilteredAddresses(currentData.address);
    }
  }, [currentData]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  useEffect(() => {
    const loweredQuery = debouncedSearchQuery.toLowerCase();
    const filtered = addresses.filter(
      (addr) =>
        addr?.address?.toLowerCase().includes(loweredQuery) ||
        addr?.location?.toLowerCase().includes(loweredQuery) ||
        addr?.pin?.toString().includes(loweredQuery) ||
        addr?.contactNo?.toString().includes(loweredQuery),
    );
    setFilteredAddresses(filtered);
  }, [debouncedSearchQuery, addresses]);

  // Debounced Search function
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  // Formik
  const formik = useFormik({
    enableReinitialize: true, // Important when using async data
    initialValues: {
      name: currentData?.name || '',
      position: currentData?.position || '',
      organization: currentData?.organization || '',
      address: currentData?.address || [],
    },
    validationSchema: toFormikValidationSchema(RawDataSchema),
    onSubmit: async (values) => {
      try {
        if (operation === 'update' && id) {
          await updateApiData(id, values as RawData);
          setAlert({
            open: true,
            message: 'Employee updated successfully!',
            severity: 'success',
          });
        } else {
          await createApiData(values as RawData);
          setAlert({
            open: true,
            message: 'Employee created successfully!',
            severity: 'success',
          });
        }
        // Wait a moment to show the success message before navigating
        navigate('/');
      } catch (error) {
        console.error('Submission error:', error);
        setAlert({
          open: true,
          message: `Failed to ${operation} employee data`,
          severity: 'error',
        });
      }
    },
  });

  return (
    <Card className="m-2 p-4 flex flex-col gap-4">
      <Typography variant="h4" fontWeight={600}>
        {operation[0].toUpperCase() + operation.substring(1).toLowerCase()}{' '}
        Employee
      </Typography>

      {/* Form Starts */}
      <form onSubmit={formik.handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Name *"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.name && formik.errors.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              fullWidth
            />
            <TextField
              label="Position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              fullWidth
            />
          </Box>

          <TextField
            label="Organization *"
            name="organization"
            value={formik.values.organization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.organization && formik.errors.organization
            }
            error={
              formik.touched.organization && Boolean(formik.errors.organization)
            }
            sx={{ width: 'calc(50% - 0.5rem)' }}
          />
        </Box>
        <Box className="mt-10 flex justify-between flex-wrap">
          <Box className="flex gap-2 items-center">
            <TextField
              type="search"
              label="Search Address"
              size="small"
              className="w-100"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>
          <Box className="flex gap-2">
            <Button variant="contained" color="error">
              <DeleteIcon />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              <AddBoxIcon />
            </Button>
          </Box>
        </Box>
        <AddAddressModal
          addressId={addressId}
          open={openModal}
          onClose={() => setOpenModal(false)}
          onAddAddress={handleAddAddress}
        />
        {/* Address Table */}
        <Box className="mt-10">
          <AddressDataGrid
            rows={filteredAddresses}
            onEditAddress={handleEditAddress}
            onDeleteAddress={handleDeleteAddress}
          />
        </Box>

        {/* Buttons */}
        <Box className="mt-4 flex justify-end gap-2">
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>

      {/* Alert/Snackbar for feedback */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AddPage;
