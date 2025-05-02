import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { AddressDataSchema } from '../utils/employee-schema'; // adjust import path
import { AddressData } from '../components/datagridLayouts/addressDatagrid'; // adjust import path
import { useEffect } from 'react';

type AddressModalProps = {
  addressId: number;
  open: boolean;
  onClose: () => void;
  onAddAddress: (newAddress: AddressData) => void;
};

const AddAddressModal = ({
  addressId,
  open,
  onClose,
  onAddAddress,
}: AddressModalProps) => {
  const formik = useFormik({
    initialValues: {
      id: addressId, // Will be updated in useEffect
      address: '',
      location: '',
      pin: '' as unknown as number,
      contactNo: '' as unknown as number,
    },
    validationSchema: toFormikValidationSchema(AddressDataSchema),
    onSubmit: (values) => {
      onAddAddress(values);
      formik.resetForm();
    },
  });

  // Update the ID value whenever addressId prop changes
  useEffect(() => {
    formik.setFieldValue('id', addressId);
  }, [addressId]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      formik.resetForm();
      formik.setFieldValue('id', addressId);
    }
  }, [open, addressId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Address</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers className="flex flex-col gap-4 mt-2">
          <TextField
            label="Address *"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            fullWidth
          />
          <TextField
            label="Location *"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            fullWidth
          />
          <TextField
            label="Pin *"
            name="pin"
            value={formik.values.pin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.pin && Boolean(formik.errors.pin)}
            helperText={formik.touched.pin && formik.errors.pin}
            type="number"
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            fullWidth
          />
          <TextField
            label="Contact No *"
            name="contactNo"
            value={formik.values.contactNo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
            helperText={formik.touched.contactNo && formik.errors.contactNo}
            type="text"
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddAddressModal;
