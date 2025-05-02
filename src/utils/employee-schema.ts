import { z } from 'zod';

// First define AddressData schema
export const AddressDataSchema = z.object({
  id: z.number(),
  address: z.string().min(1, { message: 'Address is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  pin: z.number({ invalid_type_error: 'Pin must be a number' }),
  contactNo: z
    .string()
    .regex(/^\d{10}$/, { message: 'Contact No must be exactly 10 digits' }),
});

// Now define RawData schema
export const RawDataSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .regex(/^([A-Za-z]+[. ]*)+$/, {
      message:
        'Name can only start with letters, and can contain spaces, and dots',
    }),
  position: z.string().optional(), // not marked optional, but you can do z.string().optional() if needed
  organization: z
    .string()
    .min(1, { message: 'Organization is required' })
    .regex(/^([A-Za-z0-9]+[. ]*)+$/, {
      message: 'Organization can only start with an alphabet or number.',
    }),
  address: z
    .array(AddressDataSchema)
    .min(1, { message: 'At least one address is required' }),
});
