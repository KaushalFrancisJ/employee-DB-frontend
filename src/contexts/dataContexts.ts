// RecordsDataContext.tsx
import { createContext } from 'react';
import { RawData } from '../components/datagridLayouts/PageDataGrid';

export interface RecordsContextType {
  records: RawData[];
  setRecords: React.Dispatch<React.SetStateAction<RawData[]>>;
}

export const RecordsData = createContext<RecordsContextType>({
  records: [],
  setRecords: () => {},
});
